// Where icon SVGs are fetched from. Defaults to the TatvaPractice CDN; override
// at app start (or via TPThemeProvider `iconBaseUrl`) to point elsewhere — e.g.
// a self-hosted /design-system-assets/icons copy.
//
//   import { setIconBaseUrl } from "tp-ui";
//   setIconBaseUrl("/design-system-assets/icons");
//
// Final URL = `${base}/${variant}/${name}.svg`, e.g.
//   https://pmdoctorportal.tatvacare.in/design-system-assets/icons/bold/add-basket.svg

export const ICON_BASE_DEFAULT = "https://pmdoctorportal.tatvacare.in/design-system-assets/icons";

let current = ICON_BASE_DEFAULT;

export const getIconBaseUrl = () => current;
export const setIconBaseUrl = (url) => {
  current = url == null || url === "" ? ICON_BASE_DEFAULT : String(url).replace(/\/+$/, "");
};
