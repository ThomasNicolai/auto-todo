import { Platform } from 'react-native';

export const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray500: '#9E9E9E',
};

export const Typography = {
  title: { fontSize: 28, fontWeight: '700' as const, color: Colors.black },
  heading: { fontSize: 20, fontWeight: '600' as const, color: Colors.black },
  body: { fontSize: 16, fontWeight: '400' as const, color: Colors.black },
  caption: { fontSize: 13, fontWeight: '400' as const, color: Colors.gray500 },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
