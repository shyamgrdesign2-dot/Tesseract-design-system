import { create } from 'storybook/theming';

// TatvaPractice-branded Storybook UI.
export default create({
  base: 'light',
  brandTitle: 'TatvaPractice UI',
  brandUrl: '/',
  brandImage: './brand/tatvapractice-wordmark.svg',
  brandTarget: '_self',

  colorPrimary: '#4B4AD5',   // TP blue 500
  colorSecondary: '#4B4AD5',

  appBg: '#F1F1F5',          // slate 100
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E2E2EA', // slate 200
  appBorderRadius: 10,

  fontBase: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  textColor: '#171725',      // slate 900
  textInverseColor: '#FFFFFF',
  textMutedColor: '#717179', // slate 500

  barTextColor: '#717179',
  barSelectedColor: '#4B4AD5',
  barHoverColor: '#4B4AD5',
  barBg: '#FFFFFF',

  inputBg: '#FFFFFF',
  inputBorder: '#E2E2EA',
  inputTextColor: '#171725',
  inputBorderRadius: 8,
});
