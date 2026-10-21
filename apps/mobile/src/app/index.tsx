import React from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function IndexScreen() {
  const onboardingStep = useAppStore((s) => s.onboardingStep);

  if (onboardingStep === 'done') {
    return <Redirect href="/feed" />;
  }

  return <Redirect href="/welcome" />;
}


