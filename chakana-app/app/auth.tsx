import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppRole } from '../services/auth';
import { useAuthStore } from '../store/auth';

export default function AuthScreen() {
  const router = useRouter();
  const { login, register, loading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AppRole>('client');

  const submit = async () => {
    clearError();

    if (mode === 'login') {
      await login(email.trim(), password);
    } else {
      await register(email.trim(), password, fullName.trim(), role);
    }

    const state = useAuthStore.getState();
    if (state.user) {
      router.replace(state.user.role === 'merchant' || state.user.role === 'admin' ? '/merchant-dashboard' : '/home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chakana</Text>
      <Text style={styles.subtitle}>{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</Text>

      <View style={styles.switchRow}>
        <Pressable style={[styles.switchBtn, mode === 'login' && styles.switchBtnActive]} onPress={() => setMode('login')}>
          <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>Login</Text>
        </Pressable>
        <Pressable style={[styles.switchBtn, mode === 'register' && styles.switchBtnActive]} onPress={() => setMode('register')}>
          <Text style={[styles.switchText, mode === 'register' && styles.switchTextActive]}>Registro</Text>
        </Pressable>
      </View>

      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {mode === 'register' && (
        <>
          <TextInput style={styles.input} placeholder="Nombre completo" value={fullName} onChangeText={setFullName} />
          <View style={styles.switchRow}>
            {(['client', 'merchant'] as AppRole[]).map((item) => (
              <Pressable key={item} style={[styles.roleBtn, role === item && styles.roleBtnActive]} onPress={() => setRole(item)}>
                <Text style={[styles.roleText, role === item && styles.switchTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.cta} onPress={submit} disabled={loading}>
        <Text style={styles.ctaText}>{loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F0EB',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#2E2A26',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    color: '#6B645C',
  },
  switchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  switchBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9BFB5',
    paddingVertical: 10,
    alignItems: 'center',
  },
  switchBtnActive: {
    backgroundColor: '#A63A2F',
    borderColor: '#A63A2F',
  },
  switchText: {
    color: '#6B645C',
    fontWeight: '600',
  },
  switchTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },
  roleBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9BFB5',
    alignItems: 'center',
    paddingVertical: 9,
  },
  roleBtnActive: {
    backgroundColor: '#3D3D3D',
    borderColor: '#3D3D3D',
  },
  roleText: {
    color: '#6B645C',
    fontWeight: '600',
  },
  error: {
    color: '#A63A2F',
    marginBottom: 10,
  },
  cta: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#86231A',
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
});
