import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { VerticalReelPlayer } from '@/components/ui/VerticalReelPlayer';

import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';
import { useReelsByTopicQuery } from '@/services/api/hooks/useReelsByTopicQuery';

export default function ReelPlayerScreen() {
  const router = useRouter();
  const { id, topicId } = useLocalSearchParams<{ id: string; topicId?: string }>();

  // Fetch specific reel first if topicId is not passed
  const { data: singleReel, isLoading: reelLoading } = useQuery({
    queryKey: queryKeys.reel(id || ''),
    queryFn: () => educationApi.getReelById(id || ''),
    enabled: !!id,
  });

  const effectiveTopicId = topicId || singleReel?.topicId || '';

  const handleSafeBack = () => {
    const fallback = effectiveTopicId ? `/topic/${effectiveTopicId}` : '/feed';
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

  // Fetch all reels for the topic so user can vertically swipe through them
  const { data: topicReels, isLoading: topicReelsLoading } = useReelsByTopicQuery(effectiveTopicId);

  useEffect(() => {
    if (singleReel) {
      educationApi.trackAnalyticsEvent('reel_viewed', {
        reelId: singleReel.id,
        topicId: singleReel.topicId
      });
    }
  }, [singleReel]);

  const isLoading = reelLoading || (effectiveTopicId ? topicReelsLoading : false);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  // Combine either all reels for the topic or single reel as fallback
  const reelsToDisplay =
    topicReels && topicReels.length > 0
      ? topicReels
      : singleReel
      ? [singleReel]
      : [];

  if (reelsToDisplay.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Lesson Reel" fallbackRoute={effectiveTopicId ? `/topic/${effectiveTopicId}` : '/feed'} onBack={handleSafeBack} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText tone="muted">No video reel found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <VerticalReelPlayer
      key={`${id}-${effectiveTopicId}`}
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
