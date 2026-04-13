import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { Loader } from '@/components/ui/Loader';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

import { useAppStore } from '@/store/useAppStore';
import { analytics } from '@/services/analytics/analytics';
import { ReelPlayerCard } from '../player/ReelPlayerCard';
import { VerticalReelPager } from '../player/VerticalReelPager';
import type { ReelWithContext } from '../player/types';

import { useReelsByTopicQuery } from '../hooks/useReelsByTopicQuery';
import { useTopicByIdQuery } from '@/features/topics/hooks/useTopicByIdQuery';
import { useChapterByIdQuery } from '@/features/topics/hooks/useChapterByIdQuery';

export default function ReelPlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topicId?: string;
    reelId?: string;
  }>();

  const language = useAppStore((s) => s.preferences.language);
  const bookmarkedReelIds = useAppStore((s) => s.bookmarks.reelIds);
  const toggleReelBookmark = useAppStore((s) => s.actions.toggleReelBookmark);

  const topicId = params.topicId;
  const requestedReelId = params.reelId;

  const { data: reels, isLoading: reelsLoading, isError: reelsError } =
    useReelsByTopicQuery(topicId);

  const { data: topic, isLoading: topicLoading } = useTopicByIdQuery(topicId);
  const { data: chapter } = useChapterByIdQuery(topic?.chapterId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedReelIds, setCompletedReelIds] = useState<Record<string, boolean>>(
    {}
  );

  const reelsWithContext: ReelWithContext[] = useMemo(() => {
    if (!reels || !topic) return [];
    return reels.map((reel) => ({
      reel,
      topic,
      chapter
    }));
  }, [reels, topic, chapter]);

  const initialIndex = useMemo(() => {
    if (!requestedReelId || !reels) return 0;
    const idx = reels.findIndex((r) => r.id === requestedReelId);
    return idx >= 0 ? idx : 0;
  }, [requestedReelId, reels]);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const startProgressSimulation = useCallback(() => {
    if (!reelsWithContext[activeIndex]) return () => {};

    const current = reelsWithContext[activeIndex];
    const reelId = current.reel.id;
    if (completedReelIds[reelId]) {
      setProgressPercent(1);
      return () => {};
    }

    setProgressPercent(0);
    analytics.track('reel_viewed', {
      reelId,
      topicId: topicId ?? ''
    });

    const durationMs = current.reel.estimatedSeconds * 1000;
    const start = Date.now();
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / durationMs);
      setProgressPercent(pct);

      if (pct >= 1) {
        clearInterval(interval);
        setProgressPercent(1);
        setCompletedReelIds((prev) => ({ ...prev, [reelId]: true }));
        analytics.track('reel_completed', {
          reelId,
          topicId: topicId ?? ''
        });
      }
    }, 120);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, completedReelIds, reelsWithContext, topicId]);

  useEffect(() => {
    const cleanup = startProgressSimulation();
    return cleanup;
  }, [startProgressSimulation]);

  const { height } = useWindowDimensions();

  if (reelsLoading || topicLoading) {
    return (
      <Screen className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Loader />
          <Text className="text-text-muted mt-3 text-sm">
            Loading reel…
          </Text>
        </View>
      </Screen>
    );
  }

  if (reelsError || !topicId || !topic) {
    return (
      <Screen className="flex-1 px-4 py-6">
        <View className="flex-1 justify-center">
          <Text className="text-text-primary text-base font-extrabold">
            Could not load reel
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Please go back and try again.
          </Text>
          <View className="mt-4">
            <Button onPress={() => router.replace('/feed')}>
              <Text className="text-text-primary text-center font-bold">
                Back to feed
              </Text>
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  if (reelsWithContext.length === 0) {
    return (
      <Screen className="flex-1 px-4 py-6">
        <View className="flex-1 justify-center">
          <Text className="text-text-primary text-base font-extrabold">
            No reels found
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            This topic doesn’t have reels yet.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="p-0">
      <View style={{ height }} className="flex-1">
        <VerticalReelPager
          items={reelsWithContext}
          initialIndex={initialIndex}
          onIndexChange={(idx) => setActiveIndex(idx)}
          renderItem={({ item }) => (
            <View className="flex-1">
              <ReelPlayerCard
                item={item}
                isActive={item.reel.id === reelsWithContext[activeIndex]?.reel.id}
                progressPercent={
                  item.reel.id === reelsWithContext[activeIndex]?.reel.id
                    ? progressPercent
                    : 0
                }
                language={language}
                onPressQuiz={() => {
                  const active = reelsWithContext[activeIndex]?.reel.id;
                  if (!active) return;
                  router.push({ pathname: '/quiz/[reelId]', params: { reelId: active } });
                }}
                isBookmarked={!!bookmarkedReelIds[item.reel.id]}
                onPressBookmark={() => {
                  toggleReelBookmark(item.reel.id);
                  analytics.track('topic_bookmarked', {
                    topicId: item.topic.id,
                    reelId: item.reel.id
                  });
                }}
              />
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
