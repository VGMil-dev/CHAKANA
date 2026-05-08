import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from './bottomsheet';

import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header / Logo */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
          />
          <Text style={styles.titleBlack}>Tu ciudad.</Text>
          <Text style={styles.titleRed}>Tu retorno.</Text>
          <Text style={styles.subtitle}>Aquí tu apoyo vuelve.</Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>

          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="storefront-outline" size={20} color="#9E392D" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Compra en Tambus</Text>
              <Text style={styles.cardDescription}>
                Apoya los negocios locales con identidad propia de Cuenca.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="rhombus-outline" size={20} color="#9E392D" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Acumulas Aurios reales</Text>
              <Text style={styles.cardDescription}>
                1 Aurio = 1 centavo de descuento. Valor fijo, siempre.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="refresh-outline" size={22} color="#9E392D" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>El ecosistema devuelve</Text>
              <Text style={styles.cardDescription}>
                Tu apoyo circula. Lo que siembras en la ciudad, regresa.
              </Text>
            </View>
          </View>

        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.primaryButtonText}>Conecta tu Wallet</Text>
            <Ionicons name="wallet-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryLink}
            activeOpacity={0.6}
            onPress={() => setBottomSheetVisible(true)}
          >
            <Text style={styles.secondaryLinkText}>¿Qué es un Tambu?</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB', // Crema
    paddingTop: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  titleBlack: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3D3D3D', // Gris Carbón
    lineHeight: 38,
  },
  titleRed: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9E392D', // Chakana Red
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#A09C96',
    fontWeight: '500',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FCF9F6', // Lighter surface tier, no borders
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F7E7E3', // Soft red tint for icon background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D3D3D',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#8A8580',
    lineHeight: 18,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#9E392D', // Primary Red
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLink: {
    padding: 4,
  },
  secondaryLinkText: {
    fontSize: 13,
    color: '#A09C96',
    textDecorationLine: 'underline',
  },
});
