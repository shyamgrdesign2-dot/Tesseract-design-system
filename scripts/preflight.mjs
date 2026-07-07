#!/usr/bin/env node
/**
 * Tesseract preflight — the release gate.
 *
 * Runs the internal-consistency checklist that MUST pass before any push/deploy, so a
 * change can never ship something that breaks consumers of the hosted MCP or the design
 * system. Wired in three places, all calling this one script:
 *   - local  : .githooks/pre-push (blocks `git push` until green)
 *   - CI      : .github/workflows/quality.yml (visible backstop on main/PR/tesseract)
 *   - deploy  : the Azure workflow's `preflight` job gates `build-and-deploy`
 *
 * Each check is deterministic and prints a fix. Regenerating artifacts (manifest, MCP
 * bundles, skill inventory) and diffing against git is how we detect "code changed but
 * the generated/doc surface wasn't updated". Exit non-zero on any failure.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "pipe", encoding: "utf8" });
const read = (p) => readFileSync(join(root, p), "utf8");

// Components documented elsewhere (aliases / icon component), exempt from the
// "every component has docs/components/<name>.md" rule.
const DOC_EXCEPTIONS = new Set(["MedicalIcon", "DatePicker", "Menu"]);

const results = [];
const check = (name, fn, fix) => {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail });
  } catch (e) {
    results.push({ name, ok: false, detail: e.message, fix });
  }
};
const gitClean = (paths) => {
  try { run(`git diff --quiet -- ${paths}`); }
  catch { throw new Error(`working tree differs from committed for: ${paths}`); }
};

const manifest = () => JSON.parse(read("mcp/manifest/component-manifest.json"));
const components = () => { const m = manifest(); const c = m.components || m; return Array.isArray(c) ? c : Object.values(c); };

// 1 — MCP manifest + bundles are freshly built and committed.
check("MCP artifacts fresh (manifest + dist bundles)", () => {
  run("npm run build:mcp");
  gitClean("mcp/manifest mcp/dist");
  return "manifest + server.mjs + http-server.mjs match source";
}, "run `npm run build:mcp` and commit mcp/manifest + mcp/dist");

// 2 — MCP tools smoke test passes (all 8 tools answer from the manifest).
check("MCP smoke test", () => {
  run("node mcp/test/smoke.mjs");
  return "all tools respond";
}, "fix mcp/src (build-server.mjs / tools) until `node mcp/test/smoke.mjs` passes");

// 3 — the /tesseract skill inventory is regenerated from current source.
check("Skill inventory fresh", () => {
  run("node .claude/skills/tesseract/scripts/sync-catalog.mjs");
  gitClean(".claude/skills/tesseract/references/_generated-inventory.md");
  return "skill inventory matches source";
}, "run `node .claude/skills/tesseract/scripts/sync-catalog.mjs` and commit");

// 4 — component count in the docs matches the manifest.
check("Component count matches manifest", () => {
  const n = components().length;
  const bad = [];
  for (const f of ["README.md", "docs/CATALOG.md"]) {
    if (!new RegExp(`${n}\\s+components`).test(read(f))) bad.push(f);
  }
  if (bad.length) throw new Error(`manifest has ${n} components, but not stated in: ${bad.join(", ")}`);
  return `${n} components, consistent`;
}, "update the component count in README.md / docs/CATALOG.md to the manifest total");

// 5 — every manifest component has a usage doc (or is an allowed exception).
check("Per-component docs exist", () => {
  const missing = components().map((c) => c.name)
    .filter((n) => !DOC_EXCEPTIONS.has(n) && !existsSync(join(root, "docs/components", `${n}.md`)));
  if (missing.length) throw new Error(`missing docs/components/*.md for: ${missing.join(", ")}`);
  return "all documented";
}, "add docs/components/<Name>.md for each new component (or add to DOC_EXCEPTIONS if it's an alias)");

// 6 — no broken relative .md links inside the docs surface.
check("No broken doc links", () => {
  const files = run("git ls-files 'docs/*.md' 'docs/**/*.md' README.md STARTER.md design.md")
    .split("\n").filter(Boolean);
  const broken = [];
  for (const f of files) {
    const body = read(f);
    const dir = join(root, dirname(f));
    for (const m of body.matchAll(/\]\((\.\.?\/[^)#]+\.md)(?:#[^)]*)?\)/g)) {
      if (!existsSync(join(dir, m[1]))) broken.push(`${f} → ${m[1]}`);
    }
  }
  if (broken.length) throw new Error(`broken links:\n    ${broken.join("\n    ")}`);
  return `${files.length} docs, links OK`;
}, "fix or remove the broken markdown links listed above");

// ---- report ----
const pad = Math.max(...results.map((r) => r.name.length));
let failed = 0;
console.log("\nTesseract preflight\n───────────────────");
for (const r of results) {
  console.log(`${r.ok ? "✓" : "✗"}  ${r.name.padEnd(pad)}  ${r.ok ? r.detail : ""}`);
  if (!r.ok) { failed++; console.log(`     ↳ ${r.detail}`); console.log(`     ↳ fix: ${r.fix}`); }
}
if (failed) {
  console.log(`\n✗ ${failed} check(s) failed — push blocked. Fix the above, then retry.\n`);
  process.exit(1);
}
console.log("\n✓ all checks passed — safe to push.\n");
