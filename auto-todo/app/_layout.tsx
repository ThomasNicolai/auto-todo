import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDb } from '@/lib/database';

export default function RootLayout() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Today',
            headerLargeTitle: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#000000',
          }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#000000',
            headerBackTitle: 'Today',
          }}
        />
        <Stack.Screen
          name="habit-modal"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#000000',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
