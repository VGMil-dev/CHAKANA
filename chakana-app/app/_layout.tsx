import '../polyfills';

import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AnimatedSplashScreen from '../components/core/splashscreen';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(Platform.OS === 'web');
  const { initAuth, isAuthLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  const ready = appIsReady && !isAuthLoading;

  return (
    <View style={styles.container}>
      <StatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      {!splashAnimationFinished && (
        <AnimatedSplashScreen
          onAnimationFinish={() => setSplashAnimationFinished(true)}
          isAppReady={ready}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
});
