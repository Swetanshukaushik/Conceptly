import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';

import { useAppStore } from '@/store/useAppStore';
import { useTopicsByChapterQuery } from '@/services/api/hooks/useTopicsByChapterQuery';
import { educationApi } from '@/services/api/educationApi';

export default function ExploreScreen() {
  const router = useRouter();
  const chapterId = useAppStore((s) => s.selectedChapterId);

  const { data: topics, isLoading } = useTopicsByChapterQuery(chapterId || '');

  useEffect(() => {
    if (topics) {
      educationApi.trackAnalyticsEvent('chapter_opened', {
        chapterId
      });
    }
  }, [chapterId, topics]);

  if (!chapterId) {
    return (
      <ScreenContainer>
        <AppHeader title="Topic explorer" onBack={() => router.back()} />
        <EmptyState
          title="No chapter selected"
          description="Please select a chapter first to explore topics."
        />
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Topics" onBack={() => router.back()} />
        <Loader />
      </ScreenContainer>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Topics" onBack={() => router.back()} />
        <EmptyState
          title="No topics found"
          description="This chapter doesn't have any topics yet."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Topics" onBack={() => router.back()} />
      {topics.map((item) => (
        <Pressable
          key={item.id}
          className="mb-3"
          onPress={() => {
            educationApi.trackAnalyticsEvent('topic_opened', {
              topicId: item.id
            });
            router.push(`/topic/${item.id}`);
          }}
        >
          <AppCard>
          <AppText variant="title">{item.title}</AppText>
          <View className="flex-row justify-between items-center mt-2">
            <AppText variant="caption" tone="secondary" className="capitalize">
              {item.difficulty}
            </AppText>
            <AppText variant="caption" tone="muted">
              {item.reelCount} reels
            </AppText>
          </View>
        </AppCard>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

