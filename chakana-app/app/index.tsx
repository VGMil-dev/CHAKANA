import { Redirect } from 'expo-router';
import Onboarding from "../components/onboarding/onboarding";
import { useAuth } from '../src/hooks/useAuth';

export default function Index() {
  const { isConnected } = useAuth();
  if (isConnected) return <Redirect href="/home" />;
  return <Onboarding />;
}
