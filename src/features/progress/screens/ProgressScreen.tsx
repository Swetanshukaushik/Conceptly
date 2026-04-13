import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

import { useChapterByIdQuery } from '@/features/topics/hooks/useChapterByIdQuery';
import { useProgressForChapterQuery } from '../hooks/useProgressForChapterQuery';

export default function ProgressScreen() {
  const router = useRouter();

  const chapterId = useAppStore((s) => s.selections.selectedChapterId);
  const language = useAppStore((s) => s.preferences.language);

  const { data: chapter } = useChapterByIdQuery(chapterId ?? undefined);
  const { data, isLoading, isError, refetch } = useProgressForChapterQuery(
    chapterId
  );

  const topics = data?.topics ?? [];
  const progress = data?.progress ?? [];

  const progressByTopicId = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of progress) map.set(p.topicId, p.completionPercent);
    return map;
  }, [progress]);

  const avg = useMemo(() => {
    if (topics.length === 0) return 0;
    const sum = topics.reduce((acc, t) => acc + (progressByTopicId.get(t.id) ?? 0), 0);
    return Math.round(sum / topics.length);
  }, [topics, progressByTopicId]);

  return (
    <Screen className="p-0">
      <AppHeader
        title="Progress"
        subtitle={chapter ? getLocalizedValue(chapter.title, language) : 'Your selected chapter'}
        onBack={() => router.replace({ pathname: '/feed' })}
      />

      <View className="flex-1 px-4 py-2">
        {!chapterId ? (
          <EmptyState
            title="Pick a chapter first"
            description="Complete onboarding or select a chapter to see progress."
            action={
              <Button onPress={() => router.replace({ pathname: '/explore' })}>
                <Text className="text-text-primary text-center font-bold">
                  Explore topics
                </Text>
              </Button>
            }
          />
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Loader />
            <Text className="text-text-muted mt-3 text-sm">
              Loading progress…
            </Text>
          </View>
        ) : isError ? (
          <EmptyState
            title="Could not load progress"
            description="Try again."
            action={
              <Button onPress={() => refetch()}>
                <Text className="text-text-primary text-center font-bold">
                  Retry
                </Text>
              </Button>
            }
          />
        ) : (
          <>
            <Card className="p-4 mb-4">
              <Text className="text-text-primary text-base font-extrabold">
                Overall completion
              </Text>
              <Text className="text-text-muted mt-1 text-sm">
                {avg}% across {topics.length} topics
              </Text>
              <View className="mt-3 h-1 w-full rounded-full bg-bg-card/60">
                <View
                  className="h-1 rounded-full bg-brand500"
                  style={{ width: `${avg}%` as any }}
                />
              </View>
            </Card>

            <FlatList
              data={topics}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="h-3" />}
              contentContainerClassName="pb-8"
              renderItem={({ item }) => {
                const pct = progressByTopicId.get(item.id) ?? 0;
                return (
                  <Card className="p-4">
                    <Text className="text-text-primary text-sm font-extrabold">
                      {getLocalizedValue(item.title, language)}
                    </Text>
                    <Text className="text-text-muted mt-1 text-xs">
                      {pct}% completed • {item.difficulty}
                    </Text>
                    <View className="mt-3 h-1 w-full rounded-full bg-bg-card/60">
                      <View
                        className="h-1 rounded-full bg-brand500"
                        style={{ width: `${pct}%` as any }}
                      />
                    </View>
                  </Card>
                );
              }}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

