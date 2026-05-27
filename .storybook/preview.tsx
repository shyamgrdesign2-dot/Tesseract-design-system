import type { Preview } from '@storybook/react-vite'
import '../src/tp-tailwind.css'
import '../src/tp-tokens.css'
import '../src/tp-base.css'

const preview: Preview = {
  parameters: {
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

    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'surface', value: '#F7F7FB' },
        { name: 'dark', value: '#161558' },
      ],
    },
  },
};

export default preview;