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
