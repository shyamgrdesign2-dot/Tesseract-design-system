// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Never lint build output or vendored static assets.
  globalIgnores(['dist', 'mcp/dist', 'storybook-static', 'public/tp-icons']),
  {
    // This project is authored in JS/JSX (plus a few TS config files), so the
    // linter must cover all four extensions and parse JSX.
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // `process` is provided by every major bundler (Vite/webpack/Next) via
      // `process.env.NODE_ENV` define — used here only for dev-only warnings.
      globals: { ...globals.browser, process: 'readonly' },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Ignore intentionally-unused rest siblings (props extracted to omit them
      // from a spread) and underscore-prefixed placeholders.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      // The full eslint-plugin-react-hooks v7 rule set (including the
      // react-compiler-aligned rules) is enforced as errors — the codebase
      // complies: client gating uses useIsClient, prop→state sync happens during
      // render, ids use lazy useState, and ref bridges alias the ref locally.
    },
  },
  ...storybook.configs["flat/recommended"],
  {
    // Storybook manager/addon code isn't a Vite fast-refresh module — it mixes
    // component + registration exports by design.
    files: ['.storybook/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
