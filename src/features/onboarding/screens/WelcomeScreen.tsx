import React from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { analytics } from '@/services/analytics/analytics';
import { useAppStore } from '@/store/useAppStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const setOnboardingStep = useAppStore((s) => s.actions.setOnboardingStep);

  // Track once per screen render (MVP)
  React.useEffect(() => {
    analytics.track('app_opened');
  }, []);

  return (
    <Screen className="px-4 py-8">
      <View className="flex-1 justify-between">
        <View>
          <Text className="text-text-primary text-3xl font-extrabold">
            Study smarter.
          </Text>
          <Text className="text-text-muted mt-3 text-base leading-6">
            NCERT concepts in bite-sized reels. Learn. Quiz. Track progress.
          </Text>
        </View>

        <View className="mb-2">
          <Button
            onPress={() => {
              setOnboardingStep('class_select');
              router.push('/class-select');
            }}
            className="w-full"
          >
            <Text className="text-text-primary text-center text-base font-bold">
              Get started
            </Text>
          </Button>

          <Text className="text-text-muted mt-3 text-center text-xs">
            No sign-up required for the MVP.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

