import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function AnimatedSplashScreen({
  onAnimationFinish,
  isAppReady,
}: {
  onAnimationFinish: () => void;
  isAppReady: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in when mounted
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (isAppReady) {
      // Hide the native splash screen as we show our custom one
      SplashScreen.hideAsync().catch(() => {});

      // Add a small delay to ensure the user sees the loader and the brand, then fade out
      setTimeout(() => {
        Animated.timing(hideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onAnimationFinish();
        });
      }, 1500); // 1.5 seconds minimum display time
    }
  }, [isAppReady, hideAnim, onAnimationFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: hideAnim }]} pointerEvents="none">
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
        <View style={styles.centerBlock}>
          <Animated.Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>C H A K A N A</Text>
          <Text style={styles.subtitle}>ECOSISTEMA DE ECONOMÍA CIRCULAR</Text>

          <View style={styles.separator} />

          <Text style={styles.motto}>
            Aquí tu <Text style={styles.mottoHighlight}>apoyo</Text> vuelve.
          </Text>
          <Text style={styles.location}>· CUENCA, ECUADOR ·</Text>
          
          <ActivityIndicator size="small" color="#9E392D" style={styles.loader} />
        </View>

        <View style={styles.bottomBlock}>
          <View style={styles.colorBarContainer}>
            <View style={[styles.colorBarSegment, { backgroundColor: '#9E392D' }]} />
            <View style={[styles.colorBarSegment, { backgroundColor: '#37AFB4' }]} />
            <View style={[styles.colorBarSegment, { backgroundColor: '#E2C2B3' }]} />
          </View>
          <Text style={styles.bottomText}>
            REACTIVANDO LA <Text style={styles.bottomTextHighlight}>ATENAS</Text>
          </Text>
        </View>
        
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F0EB', // Crema
    zIndex: 999,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: '#A09C96',
    letterSpacing: 2,
    marginBottom: 30,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E2C2B3',
    marginBottom: 30,
  },
  motto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D3D3D', // Gris Carbón
    marginBottom: 8,
  },
  mottoHighlight: {
    color: '#9E392D',
  },
  location: {
    fontSize: 10,
    color: '#A09C96',
    letterSpacing: 1.5,
  },
  loader: {
    marginTop: 40,
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  colorBarContainer: {
    flexDirection: 'row',
    width: '80%',
    height: 2,
    marginBottom: 15,
  },
  colorBarSegment: {
    flex: 1,
  },
  bottomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A09C96',
    letterSpacing: 2,
  },
  bottomTextHighlight: {
    color: '#9E392D',
  },
});
