import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';

import { useTopicByIdQuery } from '@/services/api/hooks/useTopicByIdQuery';
import { useReelsByTopicQuery } from '@/services/api/hooks/useReelsByTopicQuery';
import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { educationApi } from '@/services/api/educationApi';

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: topic, isLoading: topicLoading } = useTopicByIdQuery(id || '');
  const { data: reels, isLoading: reelsLoading } = useReelsByTopicQuery(id || '');
  const { data: bookmarks } = useBookmarksQuery();

  useEffect(() => {
    if (bookmarks && id) {
      const isTopicBookmarked = bookmarks.some(bookmark => bookmark.topicId === id);
      setIsBookmarked(isTopicBookmarked);
    }
  }, [bookmarks, id]);

  useEffect(() => {
    if (topic) {
      educationApi.trackAnalyticsEvent('topic_details_opened', {
        topicId: id,
        difficulty: topic.difficulty
      });
    }
  }, [id, topic]);

  if (!id) {
    return (
      <ScreenContainer className="p-0">
        <AppHeader title="Topic" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText className="text-text-muted text-center">Topic not found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  const isLoading = topicLoading || reelsLoading;

  return (
    <ScreenContainer className="p-0">
      <AppHeader title="Topic" onBack={() => router.back()} />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Loader />
        </View>
      ) : !topic ? (
        <View className="flex-1 justify-center items-center px-4">
          <AppText className="text-text-muted text-center">Topic details not available</AppText>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          <AppCard className="mb-6 p-4 bg-bg-secondary">
            <AppText className="text-text-muted text-sm">{topic.chapter.title}</AppText>
            <AppText className="text-text-primary text-2xl font-bold mt-2">{topic.title}</AppText>
            <View className="mt-3 flex-row gap-2">
              <View className="px-3 py-1 bg-accent rounded">
                <AppText className="text-white text-xs font-semibold">{topic.difficulty}</AppText>
              </View>
              <View className="px-3 py-1 bg-bg-tertiary rounded">
                <AppText className="text-text-muted text-xs">{topic.reelCount} Reels</AppText>
              </View>
            </View>
          </AppCard>

          {reels && reels.length > 0 && (
            <>
              <AppText className="text-text-primary text-lg font-bold mb-3">Learning Videos</AppText>
              <FlatList
                scrollEnabled={false}
                data={reels}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <AppCard
                    className="mb-2 p-3"
                    onPress={() => {
                      router.push(`/reel/${item.id}?topicId=${id}`);
                      educationApi.trackAnalyticsEvent('reel_started', {
                        reelId: item.id,
                        reelNumber: index + 1
                      });
                    }}
                  >
                    <AppText className="text-text-primary font-semibold">{item.title}</AppText>
                    <AppText className="text-text-muted text-xs mt-1">{item.duration || '10 min'}</AppText>
                  </AppCard>
                )}
              />
            </>
          )}

          <View className="mt-6 mb-4 gap-2">
            <AppButton
              variant="primary"
              onPress={() => {
                router.push(`/quiz/${id}`);
                educationApi.trackAnalyticsEvent('quiz_started', { topicId: id });
              }}
            >
              Take Quiz
            </AppButton>
            <AppButton
              variant="secondary"
              onPress={async () => {
                try {
                  if (isBookmarked) {
                    // Remove bookmark - this would require bookmarkId
                    // For now, just toggle the UI
                    setIsBookmarked(false);
                    educationApi.trackAnalyticsEvent('topic_unbookmarked', { topicId: id });
                  } else {
                    await educationApi.createBookmark(id);
                    setIsBookmarked(true);
                    educationApi.trackAnalyticsEvent('topic_bookmarked', { topicId: id });
                  }
                } catch (err) {
                  console.error('Bookmark error:', err);
                }
              }}
            >
              {isBookmarked ? '✓ Bookmarked' : '+ Bookmark'}
            </AppButton>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
