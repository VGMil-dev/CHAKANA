import { Redirect } from 'expo-router';
import Onboarding from "../components/onboarding/onboarding";
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { authUserId } = useAuth();

  if (authUserId) return <Redirect href="/home" />;

  return <Onboarding />;
}
