import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { useAppStore } from '@/store/useAppStore';
import { useMockData } from '@/constants/runtimeConfig';

export default function ProfileScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore((s) => s.selections.selectedSubjectId);
  const selectedChapterId = useAppStore((s) => s.selections.selectedChapterId);
  const language = useAppStore((s) => s.preferences.language);

  const setLanguage = useAppStore((s) => s.actions.setLanguage);
  const resetOnboarding = useAppStore((s) => s.actions.resetOnboarding);

  return (
    <Screen className="p-0">
      <AppHeader
        title="Profile"
        subtitle="Settings and preferences"
        onBack={() => router.replace({ pathname: '/feed' })}
      />

      <View className="flex-1 px-4 py-2 gap-4">
        <Card className="p-4">
          <Text className="text-text-primary text-base font-extrabold">
            Your selections
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Class: {selectedClassLevelId ?? '—'}
          </Text>
          <Text className="text-text-muted mt-1 text-sm">
            Subject: {selectedSubjectId ?? '—'}
          </Text>
          <Text className="text-text-muted mt-1 text-sm">
            Chapter: {selectedChapterId ?? '—'}
          </Text>

          <View className="mt-4">
            <Button
              variant="secondary"
              onPress={() => router.replace({ pathname: '/welcome' })}
            >
              <Text className="text-text-primary text-center font-bold">
                Re-run onboarding
              </Text>
            </Button>
          </View>
        </Card>

        <Card className="p-4">
          <Text className="text-text-primary text-base font-extrabold">
            Language
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Current: {language.toUpperCase()}
          </Text>
          <View className="mt-4 flex-row gap-2">
            <Button
              variant={language === 'en' ? 'primary' : 'secondary'}
              className="flex-1"
              onPress={() => setLanguage('en')}
            >
              <Text className="text-text-primary text-center font-bold">
                English
              </Text>
            </Button>
            <Button
              variant={language === 'hi' ? 'primary' : 'secondary'}
              className="flex-1"
              onPress={() => setLanguage('hi')}
            >
              <Text className="text-text-primary text-center font-bold">
                हिन्दी
              </Text>
            </Button>
          </View>
        </Card>

        <Card className="p-4">
          <Text className="text-text-primary text-base font-extrabold">
            Developer
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Mock mode: {useMockData ? 'ON' : 'OFF'}
          </Text>
          <Text className="text-text-muted mt-1 text-xs">
            Controlled via `app.json` (`expo.extra.useMockData`) or `EXPO_PUBLIC_USE_MOCK_DATA`.
          </Text>
        </Card>

        <View className="mt-auto pb-6">
          <Button
            variant="secondary"
            onPress={() => {
              resetOnboarding();
              router.replace({ pathname: '/welcome' });
            }}
          >
            <Text className="text-text-primary text-center font-bold">
              Reset app (local)
            </Text>
          </Button>
        </View>
      </View>
    </Screen>
  );
}

