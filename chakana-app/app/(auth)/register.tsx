import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../src/hooks/useWallet';
import RoleCard from '../../components/auth/RoleCard';

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { walletPubKey, isConnectingWallet, walletError, connectWallet } = useWallet();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'embajador' | 'tambu'>('embajador');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = () => {
    setError(null);
    void connectWallet();
  };

  // role defaults to 'embajador' until the role-selection step is added
  const handleRegister = async () => {
    setError(null);
    if (!walletPubKey) {
      setError('Conecta tu wallet Solana para crear tu cuenta y recibir Aurios.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(name, email, password, role, walletPubKey)
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
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.titleBlack}>Únete al</Text>
            <Text style={styles.titleRed}>ecosistema</Text>
            <Text style={styles.subtitle}>Tu apoyo vuelve. Siempre.</Text>
          </View>

          <TouchableOpacity
            style={styles.walletButton}
            onPress={handleWalletConnect}
            activeOpacity={0.8}
            testID="connect-wallet-button"
          >
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.walletButtonText}>
              {walletPubKey
                ? `Wallet ${walletPubKey.slice(0, 4)}...${walletPubKey.slice(-4)}`
                : isConnectingWallet
                  ? 'Conectando wallet...'
                  : 'Conectar wallet'}
            </Text>
          </TouchableOpacity>
          {walletError ? <Text style={styles.errorText}>{walletError}</Text> : null}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>o crea tu cuenta</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tu nombre</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="¿Cómo te llamas?"
                placeholderTextColor="#C4BFB9"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                placeholderTextColor="#C4BFB9"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#C4BFB9"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#A09C96"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <RoleCard value={role} onChange={setRole} />

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#9E392D" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, (loading || !walletPubKey) && styles.submitButtonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <Text style={styles.submitButtonText}>Crear cuenta</Text>
            }
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
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
    marginBottom: 16,
  },
  titleBlack: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3D3D3D',
    lineHeight: 32,
  },
  titleRed: {
    fontSize: 26,
    fontWeight: '800',
    color: '#9E392D',
    lineHeight: 32,
    marginBottom: 8,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3D3D3D',
    opacity: 0.1,
  },
  dividerLabel: {
    fontSize: 12,
    color: '#A09C96',
    fontWeight: '500',
  },
  form: {
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8580',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#3D3D3D',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7E7E3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#9E392D',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#9E392D',
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
    color: '#FFFFFF',
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
