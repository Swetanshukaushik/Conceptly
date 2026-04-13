import React from 'react';
import { FlatList, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { AppHeader } from '@/components/ui/AppHeader';

import { ReelPreviewCard } from '@/features/reels/components/ReelPreviewCard';

import { getLocalizedValue } from '@/types/i18n';
import { useAppStore } from '@/store/useAppStore';

import { useReelsByTopicQuery } from '@/features/reels/hooks/useReelsByTopicQuery';
import { useTopicByIdQuery } from '../hooks/useTopicByIdQuery';
import { useChapterByIdQuery } from '../hooks/useChapterByIdQuery';
import { useTopicProgressQuery } from '../hooks/useTopicProgressQuery';

export default function TopicDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topicId?: string }>();
  const topicId = params.topicId;

  const language = useAppStore((s) => s.preferences.language);

  const { data: topic, isLoading: topicLoading, isError: topicError } =
    useTopicByIdQuery(topicId);
  const { data: chapter } = useChapterByIdQuery(topic?.chapterId);
  const { data: reels, isLoading: reelsLoading, isError: reelsError } =
    useReelsByTopicQuery(topicId);
  const { data: progress, isLoading: progressLoading } =
    useTopicProgressQuery(topicId);

  const isLoading = topicLoading || reelsLoading || progressLoading;

  if (isLoading) {
    return (
      <Screen className="flex-1 items-center justify-center">
        <Loader />
        <Text className="text-text-muted mt-3 text-sm">Loading topic…</Text>
      </Screen>
    );
  }

  if (topicError || reelsError || !topicId || !topic) {
    return (
      <Screen className="px-4 py-6">
        <View className="flex-1 justify-center">
          <Text className="text-text-primary text-base font-extrabold">
            Could not load topic
          </Text>
          <View className="mt-4">
            <Button
              onPress={() =>
                router.replace({
                  pathname: '/explore'
                })
              }
            >
              <Text className="text-text-primary text-center font-bold">
                Back to explorer
              </Text>
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  const completionPercent = progress?.completionPercent ?? 0;

  return (
    <Screen className="p-0">
      <AppHeader
        title={getLocalizedValue(topic.title, language)}
        subtitle={chapter ? getLocalizedValue(chapter.title, language) : undefined}
        onBack={() => router.replace({ pathname: '/explore' })}
      />

      <View className="px-4 py-2 mb-2">
        <Card className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-text-primary text-base font-extrabold">
                Progress
              </Text>
              <Text className="text-text-muted mt-1 text-sm">
                {Math.round(completionPercent)}% completed
              </Text>
              <View className="mt-3 h-1 w-full rounded-full bg-bg-card/60">
                <View
                  className="h-1 rounded-full bg-brand500"
                  style={{ width: `${Math.round(completionPercent)}%` }}
                />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-text-muted text-xs">
                {topic.difficulty}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <FlatList
        data={reels ?? []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerClassName="px-4 pb-8"
        renderItem={({ item, index }) => (
          <View>
            <ReelPreviewCard
              reelTitle={getLocalizedValue(item.title, language)}
              thumbnailUrl={item.thumbnailUrl}
              estimatedSeconds={item.estimatedSeconds}
              difficulty={item.difficulty}
              onPress={() => {
                router.push({
                  pathname: '/topic/[topicId]/reel/[reelId]',
                  params: { topicId, reelId: item.id }
                });
              }}
            />
            {index === 0 ? (
              <Text className="text-text-muted mt-2 text-xs">
                Start from the first reel in this topic.
              </Text>
            ) : null}
          </View>
        )}
      />
    </Screen>
  );
}

