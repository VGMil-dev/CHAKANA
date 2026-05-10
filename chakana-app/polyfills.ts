import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

type GlobalWithExtras = typeof globalThis & {
  Buffer?: typeof Buffer;
  isSecureContext?: boolean;
};

const g = globalThis as GlobalWithExtras;

if (!g.Buffer) {
  g.Buffer = Buffer;
}

if (Platform.OS !== 'web' && g.isSecureContext !== true) {
  g.isSecureContext = true;
}
