import { useColorScheme } from 'react-native';

const light = {
  background: '#F6F5F2',
  surface: '#FFFFFF',
  text: '#1C1B19',
  muted: '#6E6A63',
  border: '#E4E1DA',
  accent: '#2F6FEB',
  danger: '#D14343',
};

const dark: typeof light = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#F2F0EC',
  muted: '#A19D95',
  border: '#2E2E2E',
  accent: '#6C9BFF',
  danger: '#FF6B6B',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
