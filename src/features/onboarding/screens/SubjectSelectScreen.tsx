import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { analytics } from '@/services/analytics/analytics';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

import { useSubjectsByClassLevelQuery } from '../hooks/useSubjectsByClassLevelQuery';

export default function SubjectSelectScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore(
    (s) => s.selections.selectedSubjectId
  );
  const language = useAppStore((s) => s.preferences.language);
  const setSelectedSubjectId = useAppStore(
    (s) => s.actions.setSelectedSubjectId
  );

  const { data, isLoading, isError, refetch, error } =
    useSubjectsByClassLevelQuery(selectedClassLevelId);

  const subjects = data ?? [];

  useEffect(() => {
    // Guard: subject selection requires class selection.
    if (selectedClassLevelId == null) {
      router.replace('/class-select');
    }
  }, [router, selectedClassLevelId]);

  if (selectedClassLevelId == null) {
    return (
      <Screen className="px-4 py-6">
        <View className="flex-1">
          <EmptyState
            title="Select a class first"
            description="Please go back and choose your class."
            action={
              <Button onPress={() => router.replace('/class-select')}>
                <Text className="text-text-primary text-center font-bold">
                  Choose class
                </Text>
              </Button>
            }
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="px-4 py-6">
      <View className="flex-1">
        <Text className="text-text-primary text-2xl font-extrabold">
          Pick a subject
        </Text>
        <Text className="text-text-muted mt-2 text-sm">
          We will start your personalized feed.
        </Text>

        <View className="mt-5 flex-1">
          {isLoading ? (
            <View className="mt-10 items-center">
              <Loader />
              <Text className="text-text-muted mt-3 text-sm">
                Loading subjects…
              </Text>
            </View>
          ) : isError ? (
            <EmptyState
              title="Could not load subjects"
              description="Check your connection and try again."
              action={
                <Button onPress={() => refetch()}>
                  <Text className="text-text-primary text-center font-bold">
                    Retry
                  </Text>
                </Button>
              }
            />
          ) : subjects.length === 0 ? (
            <EmptyState title="No subjects found" />
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {subjects.map((s) => (
                <Chip
                  key={s.id}
                  selected={selectedSubjectId === s.id}
                  onPress={() => {
                    setSelectedSubjectId(s.id);
                    analytics.track('subject_selected', {
                      subjectId: s.id
                    });
                  }}
                >
                  <Text className="text-text-primary text-sm font-bold">
                    {getLocalizedValue(s.label, language)}
                  </Text>
                </Chip>
              ))}
            </View>
          )}
        </View>

        <View className="mt-auto">
          <Button
            onPress={() => {
              router.push('/chapter-select');
            }}
            disabled={selectedSubjectId == null}
            className="w-full"
          >
            <Text className="text-text-primary text-center text-base font-bold">
              Next
            </Text>
          </Button>
          <Text className="text-text-muted mt-3 text-xs text-center">
            You can switch subjects anytime.
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

