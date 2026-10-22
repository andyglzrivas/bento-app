import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { migrate } from '@/db/migrate';
import { useTheme } from '@/theme';

export default function RootLayout() {
  const theme = useTheme();
  return (
    <SQLiteProvider databaseName="bento.db" onInit={migrate}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerTransparent: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'bento' }} />
        <Stack.Screen name="tile/[id]" />
      </Stack>
    </SQLiteProvider>
  );
}
