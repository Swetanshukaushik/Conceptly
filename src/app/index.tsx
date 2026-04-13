import React from 'react';
import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const onboardingStep = useAppStore((s) => s.onboarding.step);

  // MVP: if user already completed onboarding, land on feed.
  if (onboardingStep === 'completed') {
    return <Redirect href="/feed" />;
  }

  return <Redirect href="/welcome" />;
}

