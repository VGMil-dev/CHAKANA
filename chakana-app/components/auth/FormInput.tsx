import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
};

export default function FormInput({
  label, value, onChangeText, placeholder,
  secureTextEntry, keyboardType, autoCapitalize, autoCorrect,
}: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4BFB9"
          secureTextEntry={secureTextEntry ? hidden : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setHidden(h => !h)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#A09C96"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 8 },
  label: {
    fontSize: 12, fontWeight: '600', color: '#8A8580',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 14, height: 52,
    paddingHorizontal: 16, fontSize: 15, color: '#3D3D3D',
  },
  eyeButton: {
    position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center',
  },
});
