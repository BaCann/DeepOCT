// src/hooks/useThemedStyles.ts
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../theme/colors';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesFn: (theme: Theme) => T
) {
  const { theme } = useTheme();
  return useMemo(() => StyleSheet.create(stylesFn(theme)), [theme]);
}

// Cách sử dụng:
// const styles = useThemedStyles((theme) => ({
//   container: {
//     backgroundColor: theme.background,
//   },
//   text: {
//     color: theme.text,
//   },
// }));