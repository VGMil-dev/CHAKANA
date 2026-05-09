import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  FadeInDown, FadeInUp, FadeIn,
  Keyframe, useSharedValue, useAnimatedStyle, withTiming, runOnJS
} from 'react-native-reanimated';

const SPEED = 1;
const s = (sec: number) => sec * 1000 * SPEED;

const logoKeyframe = new Keyframe({
  0: { transform: [{ scale: 0.35 }, { rotate: '-22deg' }], opacity: 0 },
  55: { transform: [{ scale: 1.07 }, { rotate: '2deg' }], opacity: 1 },
  80: { transform: [{ scale: 0.97 }, { rotate: '-1deg' }], opacity: 1 },
  100: { transform: [{ scale: 1 }, { rotate: '0deg' }], opacity: 1 },
}).delay(s(0.7)).duration(s(1.1));

const dividerKeyframe = new Keyframe({
  0: { transform: [{ scaleY: 0 }] },
  100: { transform: [{ scaleY: 1 }] }
}).delay(s(2.05)).duration(s(0.6));

const barKeyframe = new Keyframe({
  0: { transform: [{ scaleX: 0 }] },
  100: { transform: [{ scaleX: 1 }] }
}).delay(s(3.5)).duration(s(2.0));

const titleLetters = ['C', 'H', 'A', 'K', 'A', 'N', 'A'];
const mottoWords = [
  { w: 'Aquí ', d: 2.30 },
  { w: 'tu ', d: 2.42 },
  { w: 'apoyo ', d: 2.54, highlight: true },
  { w: 'vuelve.', d: 2.66 },
];
const cascadeText = 'REACTIVANDO LA ATENAS'.split('');

export default function AnimatedSplashScreen({
  onAnimationFinish,
  isAppReady,
}: {
  onAnimationFinish: () => void;
  isAppReady: boolean;
}) {
  const containerOpacity = useSharedValue(1);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, s(4.0));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync().catch(() => { });
    }

    if (isAppReady && animationComplete) {
      containerOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationFinish)();
        }
      });
    }
  }, [isAppReady, animationComplete, containerOpacity, onAnimationFinish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      <View style={styles.contentContainer}>

        <View style={styles.centerBlock}>
          <Animated.Image
            entering={logoKeyframe}
            source={require('../../assets/images/splash-icon.png')}
            resizeMode="contain"
            style={styles.logo}
          />

          <View style={styles.titleContainer}>
            {titleLetters.map((l, i) => (
              <Animated.Text
                key={i}
                entering={FadeInDown.delay(s(1.25 + i * 0.06)).duration(s(0.55))}
                style={styles.titleLetter}
              >
                {l}
              </Animated.Text>
            ))}
          </View>

          <Animated.Text
            entering={FadeInDown.delay(s(1.85)).duration(s(0.55))}
            style={styles.subtitle}
          >
            ECOSISTEMA DE ECONOMÍA CIRCULAR
          </Animated.Text>

          <Animated.View
            entering={dividerKeyframe}
            style={styles.separator}
          />

          <View style={styles.mottoContainer}>
            {mottoWords.map((t, i) => (
              <Animated.Text
                key={i}
                entering={FadeInDown.delay(s(t.d)).duration(s(0.55))}
                style={[styles.motto, t.highlight && styles.mottoHighlight]}
              >
                {t.w}
              </Animated.Text>
            ))}
          </View>

          <Animated.Text
            entering={FadeInDown.delay(s(3.0)).duration(s(0.6))}
            style={styles.location}
          >
            · CUENCA, ECUADOR ·
          </Animated.Text>

          <Animated.View entering={FadeIn.delay(s(4.0)).duration(s(0.5))} style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#9E392D" />
          </Animated.View>
        </View>

        <View style={styles.bottomBlock}>
          <Animated.View
            entering={FadeInUp.delay(s(3.4)).duration(s(0.5))}
            style={styles.colorBarContainerWrapper}
          >
            <Animated.View entering={barKeyframe} style={styles.colorBarContainer}>
              <View style={[styles.colorBarSegment, { backgroundColor: '#9E392D' }]} />
              <View style={[styles.colorBarSegment, { backgroundColor: '#37AFB4' }]} />
              <View style={[styles.colorBarSegment, { backgroundColor: '#E2C2B3' }]} />
            </Animated.View>
          </Animated.View>

          <View style={styles.bottomTextContainer}>
            {cascadeText.map((ch, i) => {
              const isAtenas = i >= 15; // "REACTIVANDO LA " is 15 chars
              return (
                <Animated.Text
                  key={i}
                  entering={FadeInDown.delay(s(3.7 + i * 0.025)).duration(s(0.4))}
                  style={[styles.bottomText, isAtenas && styles.bottomTextHighlight]}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </Animated.Text>
              );
            })}
          </View>
        </View>

      </View>
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
    width: '100%',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 26,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  titleLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 2,
    marginHorizontal: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#A09C96',
    letterSpacing: 2,
    marginBottom: 22,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E2C2B3',
    marginBottom: 18,
    transformOrigin: 'top',
  },
  mottoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  motto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D3D3D',
  },
  mottoHighlight: {
    color: '#9E392D',
  },
  location: {
    fontSize: 10,
    color: '#A09C96',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  loaderContainer: {
    marginTop: 30,
    height: 20,
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  colorBarContainerWrapper: {
    width: '60%',
    height: 2,
    marginBottom: 15,
    backgroundColor: '#E6E2DD',
    borderRadius: 2,
    overflow: 'hidden',
  },
  colorBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    transformOrigin: 'left',
  },
  colorBarSegment: {
    flex: 1,
  },
  bottomTextContainer: {
    flexDirection: 'row',
  },
  bottomText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A09C96',
    letterSpacing: 2,
  },
  bottomTextHighlight: {
    color: '#9E392D',
  },
});
