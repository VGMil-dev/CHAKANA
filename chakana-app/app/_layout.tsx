import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AnimatedSplashScreen from '../components/splashscreen';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS === 'android') {
          NavigationBar.setBackgroundColorAsync('#F5F0EB').catch(() => { });
          NavigationBar.setButtonStyleAsync('dark').catch(() => { });
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar />
      <Stack
        screenOptions={{
          headerShown: false, // Hide header for the onboarding screen
        }}
      />
      {!splashAnimationFinished && (
        <AnimatedSplashScreen
          onAnimationFinish={() => setSplashAnimationFinished(true)}
          isAppReady={appIsReady}
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
