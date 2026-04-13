import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ReelPlayer } from '@/components/ui/ReelPlayer';
import { Loader } from '@/components/ui/Loader';

import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';

export default function ReelPlayerScreen() {
  const router = useRouter();
  const { id, topicId } = useLocalSearchParams<{ id: string; topicId: string }>();

  const { data: reel, isLoading } = useQuery({
    queryKey: queryKeys.reel(id || ''),
    queryFn: () => educationApi.getReelById(id || ''),
    enabled: !!id
  });

  useEffect(() => {
    if (reel) {
      educationApi.trackAnalyticsEvent('reel_viewed', {
        reelId: reel.id,
        topicId: reel.topicId
      });
    }
  }, [reel]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Learning Video" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!reel) {
    return (
      <ScreenContainer>
        <AppHeader title="Learning Video" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText className="text-text-muted text-center">Reel not found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Learning Video" onBack={() => router.back()} />
      <ReelPlayer
        videoUrl={reel.videoUrl}
        title={reel.title}
        duration={reel.durationSec}
        onComplete={() => {
          educationApi.trackAnalyticsEvent('reel_completed', {
            reelId: reel.id,
            topicId: reel.topicId
          });
        }}
      />

      <View className="px-4 py-4">
        <AppText className="text-text-primary text-lg font-bold mb-2">
          {reel.title}
        </AppText>

        <AppText className="text-text-secondary mb-4">
          {reel.topic.title} • {reel.chapter.title}
        </AppText>

        <AppButton
          label="Take Quiz"
          variant="primary"
          onPress={() => {
            router.push(`/quiz/${reel.topicId}`);
          }}
          className="mb-4"
        />

        <AppButton
          label="Back to Topic"
          variant="secondary"
          onPress={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}
