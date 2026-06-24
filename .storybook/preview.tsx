import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { TesseractThemeProvider } from '../src/theme'
import '../src/tesseract-tokens.css'
import '../src/tesseract-base.css'
import '../src/tesseract-typography.css'

const preview: Preview = {
  parameters: {
    // Design System docs first, then Foundations, then Atoms → Molecules.
    options: {
      storySort: {
        order: [
          'Design System', ['Introduction', 'Why Tesseract', 'Overview', 'Component Standards'],
          'Foundations', ['Colors', 'Typography', 'Spacing & Grid', 'Shadow & Radius', 'Icons', 'Theme Provider'],
          'Atoms', 'Molecules', '*',
        ],
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' — show violations in the test UI without failing CI
      // 'error' — fail CI on violations
      test: 'todo',
      config: {
        rules: [
          // Colour-contrast: we use the design system's token palette which is
          // WCAG AA compliant at component level; inline story chrome (labels,
          // metadata text) uses #454551 (7:1) everywhere it matters.
          // Disable the automated check that fires on decorative/demo text.
          { id: 'color-contrast', enabled: true },
          // aria-required-parent: Radix portals render outside the story root,
          // so listbox/option trees are flagged incorrectly.
          { id: 'aria-required-parent', enabled: false },
          // scrollable-region-focusable: Storybook canvas wrapper is not part
          // of the component's own DOM — suppress at preview level.
          { id: 'scrollable-region-focusable', enabled: false },
        ],
      },
    },

    // Storybook 9/10 backgrounds API: keyed options + globals selection.
    backgrounds: {
      options: {
        light:   { name: 'Light',   value: '#ffffff' },
        surface: { name: 'Surface', value: '#F7F7FB' },
        dark:    { name: 'Dark',    value: '#161558' },
      },
    },
  },

  // Toolbar toggle: light / dark / system — drives a real TesseractThemeProvider
  // around every story, so any component (not just the Theme Provider stories) can
  // be previewed in dark mode and verified against the runtime ramp remap.
  globalTypes: {
    theme: {
      description: 'Tesseract colour scheme (wraps every story in TesseractThemeProvider)',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light',  title: 'Light',  icon: 'sun' },
          { value: 'dark',   title: 'Dark',   icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    backgrounds: { value: 'light' },
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const scheme = (context.globals.theme as 'light' | 'dark' | 'system') ?? 'light'
      // Paint the wrapper only in dark/system so the light canvas still shows the
      // backgrounds-addon selection. slate-0 = bg-default, which the dark remap
      // flips to the dark surface, so the canvas matches the themed components.
      const dark = scheme !== 'light'
      return (
        <TesseractThemeProvider
          colorScheme={scheme}
          style={{
            minHeight: '100vh',
            background: dark ? 'var(--tesseract-slate-0)' : 'transparent',
            // keep layout neutral so centered/padded/fullscreen stories are unaffected
            display: 'flow-root',
          }}
        >
          <Story />
        </TesseractThemeProvider>
      )
    },
  ],
}

export default preview
