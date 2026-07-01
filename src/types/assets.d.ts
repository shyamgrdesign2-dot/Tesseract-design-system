// Ambient module declarations so the type emit (tsc) understands non-JS imports
// used by the components.
declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.scss";
declare module "*.css";
// Raw SVG imports (Vite `?raw`) — used by the Logo to bundle its brand marks.
declare module "*.svg?raw" {
  const content: string;
  export default content;
}
declare module "*.svg?url" {
  const url: string;
  export default url;
}
