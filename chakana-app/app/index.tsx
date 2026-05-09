import { Redirect } from 'expo-router';
import Onboarding from "../components/onboarding/onboarding";
import { useAuthStore } from '../store/auth';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Redirect href="/home" />;
  return <Onboarding />;
}
