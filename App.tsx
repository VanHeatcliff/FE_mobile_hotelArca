import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './app/navigation/RootNavigator';
import { RoleProvider } from './app/context/RoleContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <RoleProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </RoleProvider>
    </SafeAreaProvider>
  );
}
