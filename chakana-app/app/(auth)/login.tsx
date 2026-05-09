import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/auth/FormInput';
import AuthDivider from '../../components/auth/AuthDivider';
import ErrorAlert from '../../components/auth/ErrorAlert';

export default function Login() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder — teammate wires Phantom here
  const handleWalletConnect = () => {
    setError(null);
    // signIn with wallet address once Phantom is integrated
  };

  const handleEmailLogin = async () => {
    setError(null);
    if (!email || !password) return;
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error); setLoading(false); return; }
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => router.replace('/')} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#3D3D3D" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Bienvenido de vuelta</Text>
            <Text style={styles.subtitle}>Conecta tu identidad al ecosistema</Text>
          </View>

          <TouchableOpacity style={styles.walletButton} onPress={handleWalletConnect} activeOpacity={0.8}>
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.walletButtonText}>Conectar con Phantom</Text>
          </TouchableOpacity>

          <AuthDivider label="o continúa con correo" />

          <View style={styles.form}>
            <FormInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FormInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <ErrorAlert error={error} />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleEmailLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#9E392D" />
              : <Text style={styles.submitButtonText}>Iniciar sesión</Text>
            }
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Nuevo aquí? </Text>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Únete al ecosistema</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3D3D3D',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#A09C96',
    fontWeight: '500',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#9E392D',
    height: 56,
    borderRadius: 28,
    marginBottom: 28,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#FCF9F6',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9E392D',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#A09C96',
  },
  footerLink: {
    fontSize: 14,
    color: '#9E392D',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
