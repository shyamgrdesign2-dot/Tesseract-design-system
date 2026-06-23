// Shared layout chrome for the Foundations pages. Not stories — just helpers.
export const Page = ({ children }) => (
  <div style={{ fontFamily: "Inter, sans-serif", color: "var(--tesseract-slate-900)", padding: 28, maxWidth: 1180 }}>{children}</div>
);
export const Title = ({ children, sub }) => (
  <header style={{ marginBottom: 24 }}>
    <h1 style={{ font: "700 28px/34px Mulish, sans-serif", margin: 0 }}>{children}</h1>
    {sub && <p style={{ font: "400 14px/22px Inter, sans-serif", color: "var(--tesseract-slate-500)", margin: "8px 0 0", maxWidth: 720 }}>{sub}</p>}
  </header>
);
export const Section = ({ children }) => (
  <h2 style={{ font: "600 13px/16px Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--tesseract-slate-500)", margin: "32px 0 14px" }}>{children}</h2>
);
export const Code = ({ children }) => (
  <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, background: "var(--tesseract-slate-100)", padding: "1px 6px", borderRadius: 5, color: "var(--tesseract-slate-700)" }}>{children}</code>
);
