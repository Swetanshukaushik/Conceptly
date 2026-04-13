import React from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="justify-between">
      <View>
        <AppText variant="hero">
          Study smarter with reels.
        </AppText>
        <AppText variant="body" tone="secondary" className="mt-3">
          Mobile-first learning for students and aspirants.
        </AppText>
      </View>
      <AppButton
        label="Get started"
        onPress={() => router.push('/exam-type-select')}
      />
    </ScreenContainer>
  );
}

