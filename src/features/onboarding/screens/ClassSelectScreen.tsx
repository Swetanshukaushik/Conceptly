import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { analytics } from '@/services/analytics/analytics';
import { useClassLevelsQuery } from '../hooks/useClassLevelsQuery';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

export default function ClassSelectScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const language = useAppStore((s) => s.preferences.language);
  const setSelectedClassLevelId = useAppStore(
    (s) => s.actions.setSelectedClassLevelId
  );

  const { data, isLoading, isError, refetch, error } = useClassLevelsQuery();
  const classes = data ?? [];

  return (
    <Screen className="px-4 py-6">
      <View className="flex-1">
        <Text className="text-text-primary text-2xl font-extrabold">
          Choose your class
        </Text>
        <Text className="text-text-muted mt-2 text-sm">
          We will tailor the reels and quizzes for you.
        </Text>

        <View className="mt-5 flex-1">
          {isLoading ? (
            <View className="mt-10 items-center">
              <Loader />
              <Text className="text-text-muted mt-3 text-sm">
                Loading classes…
              </Text>
            </View>
          ) : isError ? (
            <EmptyState
              title="Could not load classes"
              description="Check your connection and try again."
              action={
                <Button onPress={() => refetch()}>
                  <Text className="text-text-primary text-center font-bold">
                    Retry
                  </Text>
                </Button>
              }
            />
          ) : classes.length === 0 ? (
            <EmptyState title="No classes available" />
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {classes.map((c) => (
                <Chip
                  key={c.id}
                  selected={selectedClassLevelId === c.id}
                  onPress={() => {
                    setSelectedClassLevelId(c.id);
                    analytics.track('class_selected', { classLevelId: c.id });
                  }}
                >
                  <Text className="text-text-primary text-sm font-bold">
                    {getLocalizedValue(c.label, language)}
                  </Text>
                </Chip>
              ))}
            </View>
          )}
        </View>

        <View className="mt-auto">
          <Button
            onPress={() => router.push('/subject-select')}
            disabled={selectedClassLevelId == null}
            className="w-full"
          >
            <Text className="text-text-primary text-center text-base font-bold">
              Next
            </Text>
          </Button>
          <Text className="text-text-muted mt-3 text-xs text-center">
            You can change this later in Profile.
          </Text>
          {isError ? (
            <Text className="text-text-muted mt-2 text-[10px] text-center">
              {String((error as Error | null)?.message ?? '')}
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

