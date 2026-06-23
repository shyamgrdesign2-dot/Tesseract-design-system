// Where icon SVGs are fetched from. Defaults to the Tesseract CDN; override
// at app start (or via TPThemeProvider `iconBaseUrl`) to point elsewhere — e.g.
// a self-hosted /tp-icons copy.
//
//   import { setIconBaseUrl } from "tesseract-ui";
//   setIconBaseUrl("/tp-icons");
//
// Final URL = `${base}/${corner}/${style}/${family}/${name}.svg`, e.g.
//   https://pmdoctorportal.tatvacare.in/tp-icons/rounded/linear/ai/ai-3d-box.svg

export const ICON_BASE_DEFAULT = "https://pmdoctorportal.tatvacare.in/tp-icons";

let current = ICON_BASE_DEFAULT;

export const getIconBaseUrl = () => current;
export const setIconBaseUrl = (url) => {
  current = url == null || url === "" ? ICON_BASE_DEFAULT : String(url).replace(/\/+$/, "");
};
