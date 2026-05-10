import { Redirect } from 'expo-router';
import Onboarding from "../components/onboarding/onboarding";
import { useAuth } from '../src/hooks/useAuth';

export default function Index() {
  const { isConnected, role } = useAuth();
  if (isConnected) return <Redirect href={role === 'tambu' ? '/dashboard' : '/home'} />;
  return <Onboarding />;
}
