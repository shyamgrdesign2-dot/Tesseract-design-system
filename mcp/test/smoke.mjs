#!/usr/bin/env node
/** Smoke test: spawn the server over stdio and exercise the tools. */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const serverPath = resolve(here, "..", "src", "server.mjs");

const transport = new StdioClientTransport({ command: "node", args: [serverPath] });
const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log("TOOLS:", tools.map((t) => t.name).join(", "));

const call = async (name, args) => {
  const r = await client.callTool({ name, arguments: args });
  return JSON.parse(r.content[0].text);
};

console.log("\nlist_components(atoms) count:", (await call("list_components", { layer: "atoms" })).count);

const badge = await call("get_component", { name: "Badge" });
console.log("get_component(Badge) props:", badge.props.map((p) => p.name).join(", "));

const v = await call("validate_usage", {
  component: "Badge",
  props: { variant: "soft", color: "success", sticky: "bottom", glow: true, className: "x" },
});
console.log("\nvalidate_usage(Badge) valid:", v.valid);
console.log("issues:", JSON.stringify(v.issues));

const good = await call("validate_usage", {
  component: "Button",
  props: { variant: "solid", theme: "primary", onClick: () => {} },
});
console.log("\nvalidate_usage(Button, good) valid:", good.valid, "issues:", good.issues.length);

console.log("\ntoken families:", (await call("get_tokens", {})).families.slice(0, 8).join(", "), "…");

// enums now filled: Button + MedicalIcon
const btn = await call("get_component", { name: "Button" });
console.log("\nButton variant allowed:", btn.props.find((p) => p.name === "variant").allowedValues.join("|"));
const mi = await call("get_component", { name: "MedicalIcon" });
console.log("MedicalIcon variant allowed:", mi.props.find((p) => p.name === "variant").allowedValues.join("|"));

// icons guardrail
const iconsMeta = await call("get_icons", {});
console.log("\nget_icons variants:", iconsMeta.variants.join("|"), "· library:", iconsMeta.libraryIconCount);
const cal = await call("get_icons", { query: "calendar", limit: 5 });
console.log("search 'calendar': matches", cal.totalMatches, "→", cal.names.join(", "));
const bogus = await call("get_icons", { query: "definitely-not-an-icon" });
console.log("validate bogus icon → isExactValidIconName:", bogus.isExactValidIconName, "(matches", bogus.totalMatches + ")");

await client.close();
console.log("\nOK");
