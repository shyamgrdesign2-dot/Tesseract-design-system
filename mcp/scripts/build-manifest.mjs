#!/usr/bin/env node
/**
 * build-manifest.mjs — extract GROUND-TRUTH component specs from the Tesseract
 * source so the MCP server never has to guess. This is the anti-hallucination
 * engine: the server answers ONLY from the JSON this produces.
 *
 * Sources of truth, in priority order, per component:
 *   1. storybook `argTypes` — the authoritative list of public props AND their
 *      allowed values (every `options: [...]`, control type, description).
 *   2. the component's prop destructure — prop names + default values.
 *   3. the leading JSDoc block — the component description.
 *   4. storybook `args` (meta) — default values.
 *
 * Output: mcp/manifest/component-manifest.json
 *
 * Run from the repo root:
 *   node mcp/scripts/build-manifest.mjs
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
let root = resolve(scriptDir, "..", "..");
if (!existsSync(join(root, "src", "components"))) {
  if (existsSync(join(process.cwd(), "src", "components"))) root = process.cwd();
  else { console.error("Cannot find src/components. Run from repo root."); process.exit(1); }
}

const LAYERS = ["atoms", "molecules"];

// Curated enum supplements for props whose allowed values can't be auto-extracted
// from stories (e.g. derived from a source map). Each value is verified against
// component source. Keep this small; prefer auto-extraction.
const ENUM_OVERRIDES = {
  // MedicalIcon.jsx: const VARIANT = { line, linear, bulk, solid, bold }
  MedicalIcon: { variant: ["line", "linear", "bulk", "solid", "bold"] },
};

/* ─────────────────────────── parsing helpers ─────────────────────────── */

/** Remove // line and /* block comments (string-aware) so unbalanced parens/
 *  braces inside comments don't corrupt brace/paren depth counting. */
function stripComments(src) {
  let out = "", i = 0, inStr = null, prev = "";
  const n = src.length;
  while (i < n) {
    const ch = src[i], nx = src[i + 1];
    if (inStr) {
      out += ch;
      if (ch === inStr && prev !== "\\") inStr = null;
      prev = ch === "\\" && prev === "\\" ? "" : ch;
      i++; continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; out += ch; prev = ch; i++; continue; }
    if (ch === "/" && nx === "/") { i += 2; while (i < n && src[i] !== "\n") i++; continue; }
    if (ch === "/" && nx === "*") { i += 2; while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; out += " "; continue; }
    out += ch; prev = ch; i++;
  }
  return out;
}

/** Return the `{...}` substring (balanced) starting at/after `from`. */
function balancedBraces(src, from) {
  const start = src.indexOf("{", from);
  if (start === -1) return null;
  let depth = 0, inStr = null, prev = "";
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === inStr && prev !== "\\") inStr = null;
    } else if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) return src.slice(start, i + 1); }
    prev = ch;
  }
  return null;
}

/** Split an object body into top-level `key: valueSource` pairs. */
function topLevelEntries(objSrc) {
  const body = objSrc.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
  const entries = [];
  let depth = 0, inStr = null, prev = "", token = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inStr) {
      token += ch;
      if (ch === inStr && prev !== "\\") inStr = null;
      prev = ch; continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; token += ch; prev = ch; continue; }
    if ("{[(".includes(ch)) depth++;
    else if ("}])".includes(ch)) depth--;
    if (ch === "," && depth === 0) { if (token.trim()) entries.push(token); token = ""; prev = ch; continue; }
    token += ch; prev = ch;
  }
  if (token.trim()) entries.push(token);

  return entries.map((e) => {
    const m = e.match(/^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_$]+))\s*:\s*([\s\S]*)$/);
    if (!m) return null;
    const key = m[1] || m[2] || m[3];
    return { key, value: m[4].trim() };
  }).filter(Boolean);
}

/** Pull string literals out of an array source like `["a","b"]`. */
function stringArray(src) {
  if (!src) return null;
  const m = src.match(/\[([\s\S]*?)\]/);
  if (!m) return null;
  const items = [...m[1].matchAll(/['"`]([^'"`]*)['"`]/g)].map((x) => x[1]);
  return items.length ? items : null;
}

/** Clean a leading JSDoc block into a one-paragraph description. */
function jsdocDescription(src, beforeIndex) {
  const head = src.slice(0, beforeIndex);
  const blocks = [...head.matchAll(/\/\*\*([\s\S]*?)\*\//g)];
  if (!blocks.length) return null;
  const last = blocks[blocks.length - 1][1];
  const lines = last.split("\n")
    .map((l) => l.replace(/^\s*\*?\s?/, "").trim())
    .filter((l) => l && !l.startsWith("@") && !/^[─-]{3,}$/.test(l));
  const desc = [];
  for (const l of lines) { if (/^(Props|Usage|Example)\b/i.test(l)) break; desc.push(l); }
  return desc.join(" ").trim() || null;
}

/** Parse a destructure body `{ a, b = 1, c: alias = 2, ...rest }` → props. */
function parseDestructure(objSrc) {
  const body = objSrc.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
  const tokens = [];
  let depth = 0, inStr = null, prev = "", token = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inStr) { token += ch; if (ch === inStr && prev !== "\\") inStr = null; prev = ch; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; token += ch; prev = ch; continue; }
    if ("{[(".includes(ch)) depth++;
    else if ("}])".includes(ch)) depth--;
    if (ch === "," && depth === 0) { if (token.trim()) tokens.push(token); token = ""; prev = ch; continue; }
    token += ch; prev = ch;
  }
  if (token.trim()) tokens.push(token);

  const props = [];
  for (const t of tokens) {
    const s = t.trim();
    if (!s || s.startsWith("...")) continue;
    // find top-level `=` default (ignore ==, =>, <=, >=)
    let d = 0, eq = -1, ist = null, pv = "";
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (ist) { if (c === ist && pv !== "\\") ist = null; pv = c; continue; }
      if (c === '"' || c === "'" || c === "`") { ist = c; pv = c; continue; }
      if ("{[(".includes(c)) d++;
      else if ("}])".includes(c)) d--;
      if (c === "=" && d === 0 && s[i + 1] !== "=" && s[i + 1] !== ">" && pv !== "=" && pv !== "!" && pv !== "<" && pv !== ">") { eq = i; break; }
      pv = c;
    }
    let name = eq === -1 ? s : s.slice(0, eq);
    const def = eq === -1 ? undefined : s.slice(eq + 1).trim();
    name = name.split(":")[0].trim(); // `c: alias` → public name is `c`
    if (/^[A-Za-z_$][\w$]*$/.test(name)) props.push({ name, default: def });
  }
  return props;
}

/** Find `function Name(...)` (incl. forwardRef-wrapped) → props with defaults. */
function destructureProps(fileSrc) {
  const out = {};
  const re = /function\s+([A-Z][A-Za-z0-9_]*)\s*\(/g;
  let m;
  while ((m = re.exec(fileSrc))) {
    const name = m[1];
    const obj = balancedBraces(fileSrc, m.index + m[0].length - 1);
    if (!obj) { if (!(name in out)) out[name] = []; continue; }
    // only treat as props if the first `{` is the param destructure (before body)
    const between = fileSrc.slice(m.index + m[0].length - 1, fileSrc.indexOf(obj));
    if (/\)\s*\{/.test(between)) { if (!(name in out)) out[name] = []; continue; }
    out[name] = parseDestructure(obj);
  }
  return out;
}

/** Parse a stories file: argTypes (props+enums), args (defaults), story names. */
function parseStories(storiesRaw) {
  const storiesSrc = stripComments(storiesRaw);
  const result = { argTypes: {}, args: {}, stories: [] };
  // top-level `const NAME = ['a','b']` arrays, so `options: NAME` can be resolved.
  const constArrays = {};
  for (const m of storiesSrc.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(\[[\s\S]*?\])/g)) {
    const vals = stringArray(m[2]);
    if (vals) constArrays[m[1]] = vals;
  }
  // argTypes
  const atIdx = storiesSrc.search(/argTypes\s*:/);
  if (atIdx !== -1) {
    const obj = balancedBraces(storiesSrc, atIdx);
    if (obj) {
      for (const { key, value } of topLevelEntries(obj)) {
        const spec = {};
        // options as an inline array, or as a reference to a top-level const array
        let optsArr = stringArray((value.match(/options\s*:\s*(\[[\s\S]*?\])/) || [])[1]);
        if (!optsArr) {
          const ref = (value.match(/options\s*:\s*([A-Za-z_$][\w$]*)/) || [])[1];
          if (ref && constArrays[ref]) optsArr = constArrays[ref];
        }
        if (optsArr) spec.options = optsArr;
        const ctrl = (value.match(/control\s*:\s*['"]([^'"]+)['"]/) || value.match(/control\s*:\s*\{[^}]*type\s*:\s*['"]([^'"]+)['"]/) || [])[1];
        if (ctrl) spec.control = ctrl;
        const desc = (value.match(/description\s*:\s*['"]([^'"]+)['"]/) || [])[1];
        if (desc) spec.description = desc;
        const disabled = /table\s*:\s*\{[^}]*disable\s*:\s*true/.test(value);
        if (disabled) spec.hidden = true;
        result.argTypes[key] = spec;
      }
    }
  }
  // args (meta defaults) — first top-level `args:` in the file (the meta block)
  const argsIdx = storiesSrc.search(/\bargs\s*:/);
  if (argsIdx !== -1) {
    const obj = balancedBraces(storiesSrc, argsIdx);
    if (obj) for (const { key, value } of topLevelEntries(obj)) result.args[key] = value;
  }
  // component-level docs: docs: { description: { component: "..." } }
  const docIdx = storiesSrc.search(/description\s*:\s*\{\s*component\s*:/);
  if (docIdx !== -1) {
    const tail = storiesSrc.slice(docIdx);
    const strs = [...tail.matchAll(/['"`]([^'"`]*)['"`]/g)].slice(0, 6).map((x) => x[1]);
    // join consecutive string-literal fragments (handles "a" + "b" concatenation)
    const joined = strs.join("").trim();
    if (joined) result.componentDoc = joined;
  }
  // story export names
  for (const m of storiesSrc.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=/g)) {
    result.stories.push(m[1]);
  }
  return result;
}

/* ─────────────────────────── barrels ─────────────────────────── */

function parseBarrel(indexPath) {
  // returns map exportName -> relative module (e.g. Button -> ./Button)
  const map = {};
  if (!existsSync(indexPath)) return map;
  const src = readFileSync(indexPath, "utf8");
  for (const m of src.matchAll(/export\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g)) {
    const mod = m[2];
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (name) map[name] = mod;
    }
  }
  return map;
}

/* ─────────────────────────── tokens ─────────────────────────── */

function parseTokens() {
  const tokensPath = join(root, "src", "tesseract-tokens.css");
  if (!existsSync(tokensPath)) return { families: {}, count: 0 };
  const css = readFileSync(tokensPath, "utf8");
  const families = {};
  let count = 0;
  for (const m of css.matchAll(/(--tesseract-[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = m[1].trim();
    const value = m[2].trim();
    count++;
    const fam = name.replace(/^--tesseract-/, "").split("-")[0];
    (families[fam] ||= []).push({ name, value });
  }
  return { families, count };
}

/* ─────────────────────────── icons ─────────────────────────── */

function parseIcons() {
  const dir = join(root, "src", "components", "atoms", "icons", "tp");
  const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  const variants = stringArray((read("registry.js").match(/TP_ICON_VARIANTS\s*=\s*(\[[\s\S]*?\])/) || [])[1])
    || ["linear", "bulk", "bold"];
  const curatedVariants = stringArray((read("constants.js").match(/TP_ICON_VARIANTS\s*=\s*(\[[\s\S]*?\])/) || [])[1])
    || ["linear", "bulk", "bold"];
  // TP_LIBRARY_ICONS is a huge flat array — balanced bracket via indexOf (no nesting).
  const lib = read("library-names.js");
  let names = [];
  const i = lib.indexOf("TP_LIBRARY_ICONS");
  if (i !== -1) {
    const open = lib.indexOf("[", i), close = lib.indexOf("]", open);
    if (open !== -1 && close !== -1) names = [...lib.slice(open, close).matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
  }
  return { variants, curatedVariants, names };
}

/* ─────────────────────────── component scan ─────────────────────────── */

function componentNameForDir(dir, barrel) {
  // prefer the exported name whose module is ./<dir>
  const hit = Object.entries(barrel).find(([, mod]) => mod === `./${dir}`);
  return hit ? hit[0] : dir;
}

function scanLayer(layer) {
  const base = join(root, "src", "components", layer);
  const barrel = parseBarrel(join(base, "index.js"));
  const comps = [];
  if (!existsSync(base)) return { comps, barrel };

  for (const dir of readdirSync(base)) {
    const dirPath = join(base, dir);
    if (!statSync(dirPath).isDirectory()) continue;
    const files = readdirSync(dirPath);
    const mainFiles = files.filter((f) => f.endsWith(".jsx") && !f.endsWith(".stories.jsx"));
    const storyFile = files.find((f) => f.endsWith(".stories.jsx"));
    if (!mainFiles.length) continue;

    // merge prop destructures + description across main files
    let propsByFn = {};
    let description = null;
    for (const f of mainFiles) {
      const src = readFileSync(join(dirPath, f), "utf8");
      const fns = destructureProps(stripComments(src));
      Object.assign(propsByFn, fns);
      if (!description) {
        const decl = src.search(/export\s+(?:const|function|default)/);
        description = jsdocDescription(src, decl === -1 ? src.length : decl);
      }
    }

    const stories = storyFile ? parseStories(readFileSync(join(dirPath, storyFile), "utf8")) : null;
    if (!description && stories?.componentDoc) description = stories.componentDoc;

    // the primary exported component for this dir
    const primaryName = componentNameForDir(dir, barrel);
    const allExports = Object.entries(barrel).filter(([, mod]) => mod === `./${dir}`).map(([n]) => n);

    // assemble props: union of destructure + argTypes, enriched with enums/defaults
    const fnKeys = Object.keys(propsByFn);
    // pick the fn matching primaryName, else the first
    const fnName = fnKeys.includes(primaryName) ? primaryName : fnKeys[0];
    const baseProps = (propsByFn[fnName] || []);
    const propMap = new Map();
    for (const p of baseProps) propMap.set(p.name, { name: p.name, default: cleanVal(p.default) });
    if (stories) {
      for (const [k, spec] of Object.entries(stories.argTypes)) {
        const existing = propMap.get(k) || { name: k };
        if (spec.options) existing.allowedValues = spec.options;
        if (spec.control && !existing.control) existing.control = spec.control;
        if (spec.description && !existing.description) existing.description = spec.description;
        if (spec.hidden) existing.storyHidden = true;
        propMap.set(k, existing);
      }
      for (const [k, v] of Object.entries(stories.args)) {
        const existing = propMap.get(k);
        if (existing && existing.default === undefined) existing.default = cleanVal(v);
      }
    }

    comps.push({
      name: primaryName,
      dir,
      layer,
      exports: allExports.length ? allExports : [primaryName],
      importFrom: `@/src/components/${layer}`,
      importExample: `import { ${(allExports.length ? allExports : [primaryName]).join(", ")} } from "@/src/components/${layer}";`,
      description: description || null,
      props: [...propMap.values()],
      stories: stories ? stories.stories : [],
      sourcePath: `src/components/${layer}/${dir}/${mainFiles[0]}`,
      storiesPath: storyFile ? `src/components/${layer}/${dir}/${storyFile}` : null,
    });
  }
  return { comps: comps.sort((a, b) => a.name.localeCompare(b.name)), barrel };
}

function cleanVal(v) {
  if (v === undefined) return undefined;
  return String(v).replace(/\s+/g, " ").trim().slice(0, 120);
}

/* ─────────────────────────── build ─────────────────────────── */

const components = [];
for (const layer of LAYERS) {
  const { comps } = scanLayer(layer);
  components.push(...comps);
}
// apply curated enum supplements
for (const c of components) {
  const ov = ENUM_OVERRIDES[c.name];
  if (!ov) continue;
  for (const p of c.props) if (ov[p.name] && !p.allowedValues) p.allowedValues = ov[p.name];
}
const tokens = parseTokens();
const icons = parseIcons();

const manifest = {
  $schema: "tesseract-component-manifest/v1",
  generatedFrom: "src/components/** + src/tesseract-tokens.css",
  generatedAtNote: "regenerate with: node mcp/scripts/build-manifest.mjs",
  designSystem: { package: "tesseract-ui", importAliases: LAYERS.map((l) => `@/src/components/${l}`) },
  counts: {
    components: components.length,
    atoms: components.filter((c) => c.layer === "atoms").length,
    molecules: components.filter((c) => c.layer === "molecules").length,
    tokens: tokens.count,
  },
  rules: [
    "Use only components and props listed here — they are extracted from real source.",
    "Use only allowedValues for a prop when present; they come from storybook argTypes.",
    "Colours/spacing/radii must be --tesseract-* tokens; never raw values.",
    "No odd numbers in dimensions. Never edit tesseract-tokens.css.",
    "Never substitute Ant Design / MUI / Tailwind / raw Radix.",
  ],
  icons: {
    variants: icons.variants,
    curatedVariants: icons.curatedVariants,
    libraryCount: icons.names.length,
    namesFile: "icon-names.json",
    note: "Search/validate icon names with the get_icons MCP tool. TPLibraryIcon accepts any of the libraryCount names; TPIcon uses a curated subset; `variant` must be one of `variants`.",
  },
  components,
  tokenFamilies: Object.fromEntries(
    Object.entries(tokens.families).map(([fam, list]) => [fam, list.map((t) => t.name)])
  ),
  tokens: tokens.families,
};

const outDir = join(root, "mcp", "manifest");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "component-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");

// icon names live in a sibling file to keep the component manifest lean
const iconPath = join(outDir, "icon-names.json");
writeFileSync(iconPath, JSON.stringify({
  variants: icons.variants,
  curatedVariants: icons.curatedVariants,
  count: icons.names.length,
  names: icons.names,
}, null, 0), "utf8");

console.log(`Wrote ${outPath}`);
console.log(`Wrote ${iconPath}`);
console.log(`Components: ${manifest.counts.components} (atoms ${manifest.counts.atoms}, molecules ${manifest.counts.molecules}) · tokens ${manifest.counts.tokens} · icons ${icons.names.length}`);
const withEnums = components.filter((c) => c.props.some((p) => p.allowedValues)).length;
console.log(`Components with extracted allowed-value enums: ${withEnums}/${components.length}`);
