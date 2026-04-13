import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { analytics } from '@/services/analytics/analytics';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

import { useChaptersBySubjectQuery } from '../hooks/useChaptersBySubjectQuery';

export default function ChapterSelectScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore((s) => s.selections.selectedSubjectId);
  const selectedChapterId = useAppStore((s) => s.selections.selectedChapterId);
  const language = useAppStore((s) => s.preferences.language);

  const setSelectedChapterId = useAppStore(
    (s) => s.actions.setSelectedChapterId
  );
  const completeOnboarding = useAppStore((s) => s.actions.completeOnboarding);

  const { data, isLoading, isError, refetch, error } =
    useChaptersBySubjectQuery({
      classLevelId: selectedClassLevelId,
      subjectId: selectedSubjectId
    });

  useEffect(() => {
    if (selectedClassLevelId == null) {
      router.replace('/class-select');
      return;
    }
    if (selectedSubjectId == null) {
      router.replace('/subject-select');
    }
  }, [router, selectedClassLevelId, selectedSubjectId]);

  if (selectedClassLevelId == null || selectedSubjectId == null) {
    return (
      <Screen className="px-4 py-6">
        <EmptyState
          title="Complete previous steps"
          description="Select your class and subject first."
        />
      </Screen>
    );
  }

  const chapters = data ?? [];

  return (
    <Screen className="px-4 py-6">
      <View className="flex-1">
        <Text className="text-text-primary text-2xl font-extrabold">
          Choose a chapter
        </Text>
        <Text className="text-text-muted mt-2 text-sm">
          We’ll start your feed from this chapter.
        </Text>

        <View className="mt-5 flex-1">
          {isLoading ? (
            <View className="mt-10 items-center">
              <Loader />
              <Text className="text-text-muted mt-3 text-sm">
                Loading chapters…
              </Text>
            </View>
          ) : isError ? (
            <EmptyState
              title="Could not load chapters"
              description="Check your connection and try again."
              action={
                <Button onPress={() => refetch()}>
                  <Text className="text-text-primary text-center font-bold">
                    Retry
                  </Text>
                </Button>
              }
            />
          ) : chapters.length === 0 ? (
            <EmptyState
              title="No chapters found"
              description="Try another subject."
            />
          ) : (
            <View className="gap-3">
              {chapters.map((c) => (
                <Card key={c.id} className="p-4">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-text-primary text-sm font-extrabold">
                        {getLocalizedValue(c.title, language)}
                      </Text>
                      <Text className="text-text-muted mt-1 text-xs">
                        Tap to select
                      </Text>
                    </View>
                    <Chip
                      selected={selectedChapterId === c.id}
                      onPress={() => {
                        setSelectedChapterId(c.id);
                        analytics.track('chapter_selected', {
                          chapterId: c.id
                        });
                      }}
                    >
                      <Text className="text-text-primary text-[11px] font-bold">
                        {selectedChapterId === c.id ? 'Selected' : 'Select'}
                      </Text>
                    </Chip>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>

        <View className="mt-auto">
          <Button
            onPress={() => {
              completeOnboarding();
              analytics.track('onboarding_completed', {
                classLevelId: selectedClassLevelId,
                subjectId: selectedSubjectId,
                chapterId: selectedChapterId ?? undefined
              });
              router.replace('/feed');
            }}
            disabled={selectedChapterId == null}
            className="w-full"
          >
            <Text className="text-text-primary text-center text-base font-bold">
              Continue
            </Text>
          </Button>

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

