/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Runs every story as a test in a real browser (Playwright/Chromium):
//   • stories with no `play` get a smoke test (renders without throwing)
//   • stories with a `play` run their interaction assertions
//   • the a11y addon runs axe on each (configured in .storybook/preview)
// One `npm run test-storybook` gate covering render + interaction + a11y across
// the whole library. addon-vitest (>=10.3) auto-applies the preview annotations,
// so no setup file is needed.
export default defineConfig({
  plugins: [storybookTest({ configDir: join(here, '.storybook') })],
  resolve: { alias: { '@': here } },
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
