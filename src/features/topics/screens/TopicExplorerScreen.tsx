import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { AppHeader } from '@/components/ui/AppHeader';

import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

import { analytics } from '@/services/analytics/analytics';

import type { ChapterId } from '@/types/ids';

import { useChaptersBySubjectQuery } from '../hooks/useChaptersBySubjectQuery';
import { useTopicsByChapterQuery } from '../hooks/useTopicsByChapterQuery';
import { useTopicProgressQuery } from '../hooks/useTopicProgressQuery';

export default function TopicExplorerScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore((s) => s.selections.selectedSubjectId);
  const language = useAppStore((s) => s.preferences.language);

  const { data: chapters, isLoading, isError, refetch } =
    useChaptersBySubjectQuery({
      classLevelId: selectedClassLevelId,
      subjectId: selectedSubjectId
    });

  const [expandedChapterId, setExpandedChapterId] = useState<ChapterId | null>(
    null
  );

  useEffect(() => {
    if (!expandedChapterId && chapters && chapters.length > 0) {
      setExpandedChapterId(chapters[0].id);
    }
  }, [chapters, expandedChapterId]);

  const { data: topics, isLoading: topicsLoading, isError: topicsError, refetch: refetchTopics } =
    useTopicsByChapterQuery(expandedChapterId ?? undefined);

  return (
    <Screen className="p-0">
      <AppHeader
        title="Explore topics"
        subtitle="Chapter-by-chapter learning for your syllabus."
        onBack={() => router.replace({ pathname: '/feed' })}
      />
      <View className="px-4 py-2 flex-1">

      {isLoading ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Loader />
          <Text className="text-text-muted mt-3 text-sm">
            Loading chapters…
          </Text>
        </View>
      ) : isError ? (
        <EmptyState
          title="Could not load chapters"
          description="Please retry."
          action={
            <View className="w-full">
              <View className="w-full">
                <Pressable
                  onPress={() => refetch()}
                  className="bg-brand500 rounded-xl px-4 py-3"
                >
                  <Text className="text-text-primary text-center font-bold">
                    Retry
                  </Text>
                </Pressable>
              </View>
            </View>
          }
        />
      ) : !chapters || chapters.length === 0 ? (
        <EmptyState
          title="No chapters found"
          description="Try changing class or subject."
        />
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={({ item: chapter }) => (
            <View className="mb-4">
              <Pressable
                onPress={() => setExpandedChapterId(chapter.id)}
              >
                <Card className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-text-primary text-base font-extrabold">
                        {getLocalizedValue(chapter.title, language)}
                      </Text>
                      <Text className="text-text-muted mt-1 text-xs">
                        {topicsLoading && expandedChapterId === chapter.id
                          ? 'Loading topics…'
                          : 'Tap to view topics'}
                      </Text>
                    </View>
                    <Chip
                      selected={expandedChapterId === chapter.id}
                      className="border-border"
                      onPress={() => setExpandedChapterId(chapter.id)}
                    >
                      <Text className="text-text-primary text-[11px] font-bold">
                        {expandedChapterId === chapter.id ? 'Open' : 'View'}
                      </Text>
                    </Chip>
                  </View>
                </Card>
              </Pressable>

              {expandedChapterId === chapter.id ? (
                <View className="mt-3">
                  {topicsLoading ? (
                    <View className="py-4 items-center">
                      <Loader />
                      <Text className="text-text-muted mt-2 text-xs">
                        Loading topics…
                      </Text>
                    </View>
                  ) : topicsError ? (
                    <View>
                      <EmptyState
                        title="Could not load topics"
                        description="Retry to fetch topics."
                        action={
                          <Pressable
                            onPress={() => refetchTopics()}
                            className="bg-brand500 rounded-xl px-4 py-3"
                          >
                            <Text className="text-text-primary text-center font-bold">
                              Retry
                            </Text>
                          </Pressable>
                        }
                      />
                    </View>
                  ) : (
                    <View className="gap-3">
                      {(topics ?? []).map((topic) => (
                        <TopicRow
                          key={topic.id}
                          topicId={topic.id}
                          title={getLocalizedValue(topic.title, language)}
                          estimatedReelCount={topic.estimatedReelCount}
                          difficulty={topic.difficulty}
                          onOpen={() => {
                            router.push({
                              pathname: '/topic/[topicId]',
                              params: { topicId: topic.id }
                            });
                          }}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View className="h-6" />}
        />
      )}
      </View>
    </Screen>
  );
}

function TopicRow({
  topicId,
  title,
  estimatedReelCount,
  difficulty,
  onOpen
}: {
  topicId: string;
  title: string;
  estimatedReelCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onOpen: () => void;
}) {
  const { data: progress } = useTopicProgressQuery(topicId);

  const pct = progress?.completionPercent ?? 0;

  return (
    <Pressable onPress={onOpen}>
      <Card className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-text-primary text-sm font-extrabold">
              {title}
            </Text>
            <Text className="text-text-muted mt-1 text-xs">
              {estimatedReelCount} reels • {difficulty}
            </Text>
            <View className="mt-3 h-1 w-full rounded-full bg-bg-card/60">
              <View
                className="h-1 rounded-full bg-brand500"
                style={{ width: `${Math.round(pct)}%` }}
              />
            </View>
          </View>
          <View className="items-end">
            <Text className="text-text-muted text-xs">{Math.round(pct)}%</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

