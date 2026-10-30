import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useIsFocused } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { VerticalReelPlayer } from '@/components/ui/VerticalReelPlayer';

import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';
import { useReelsByTopicQuery } from '@/services/api/hooks/useReelsByTopicQuery';
import { useTrendingReelsQuery } from '@/services/api/hooks/useTrendingReelsQuery';
import type { TrendingReelSortBy } from '@/services/api/types';

export default function ReelPlayerScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { id, topicId, playlist, sortBy } = useLocalSearchParams<{
    id: string;
    topicId?: string;
    playlist?: string;
    sortBy?: string;
  }>();
  const isTrendingPlaylist = playlist === 'trending';

  // Fetch specific reel first if topicId is not passed
  const { data: singleReel, isLoading: reelLoading } = useQuery({
    queryKey: queryKeys.reel(id || ''),
    queryFn: () => educationApi.getReelById(id || ''),
    enabled: !!id,
  });

  const effectiveTopicId = topicId || singleReel?.topicId || '';

  const handleSafeBack = () => {
    const fallback = isTrendingPlaylist
      ? '/trending'
      : effectiveTopicId
      ? `/topic/${effectiveTopicId}`
      : '/feed';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.history.length > 1 && router.canGoBack()) {
        router.back();
        return;
      }
      router.replace(fallback as any);
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as any);
    }
  };

  // Fetch all reels for the topic OR all trending community reels if launched from Trending feed
  const { data: topicReels, isLoading: topicReelsLoading } = useReelsByTopicQuery(effectiveTopicId);
  const { data: trendingFeed, isLoading: trendingLoading } = useTrendingReelsQuery({
    sortBy: (sortBy as TrendingReelSortBy) ?? 'trending',
    timeWindow: '24h',
  });

  useEffect(() => {
    if (singleReel) {
      educationApi.trackAnalyticsEvent('reel_viewed', {
        reelId: singleReel.id,
        topicId: singleReel.topicId,
        playlist: isTrendingPlaylist ? 'trending' : 'topic',
      });
    }
  }, [singleReel, isTrendingPlaylist]);

  const isLoading =
    reelLoading ||
    (isTrendingPlaylist ? trendingLoading : effectiveTopicId ? topicReelsLoading : false);

  // When this screen is no longer focused (e.g. user opened the quiz), unmount the player so
  // video stops and its global wheel/keyboard listeners are released.
  if (!isFocused) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  // Combine either trending community reels, all reels for the topic, or single reel as fallback
  const reelsToDisplay =
    isTrendingPlaylist && trendingFeed?.items && trendingFeed.items.length > 0
      ? trendingFeed.items
      : topicReels && topicReels.length > 0
      ? topicReels
      : singleReel
      ? [singleReel]
      : [];

  if (reelsToDisplay.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Lesson Reel"
          fallbackRoute={
            isTrendingPlaylist ? '/trending' : effectiveTopicId ? `/topic/${effectiveTopicId}` : '/feed'
          }
          onBack={handleSafeBack}
        />
        <View className="flex-1 justify-center items-center px-4">
          <AppText tone="muted">No video reel found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <VerticalReelPlayer
      key={`${id}-${isTrendingPlaylist ? 'trending' : effectiveTopicId}`}
      reels={reelsToDisplay}
      initialReelId={id}
      onBack={handleSafeBack}
      onQuizPress={(targetTopicId) => {
        router.push(`/quiz/${targetTopicId}`);
      }}
      onFlashcardPress={(targetTopicId) => {
        router.push(`/topic/${targetTopicId}`);
      }}
    />
  );
}
