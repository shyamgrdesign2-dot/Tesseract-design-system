import { createContext, useContext } from "react";

// Theme context lives in its own module so the provider file stays component-only.
export const ThemeContext = createContext({ colorScheme: "light", setColorScheme: () => {}, tokens: {} });

export function useTheme() {
  return useContext(ThemeContext);
}
