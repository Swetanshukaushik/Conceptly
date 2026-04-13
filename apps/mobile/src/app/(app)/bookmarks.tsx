import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';

import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { educationApi } from '@/services/api/educationApi';

export default function BookmarksScreen() {
  const router = useRouter();
  const { data: bookmarks, isLoading, refetch } = useBookmarksQuery();

  useEffect(() => {
    educationApi.trackAnalyticsEvent('bookmarks_viewed');
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Bookmarks" onBack={() => router.back()} />
        <Loader />
      </ScreenContainer>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Bookmarks" onBack={() => router.back()} />
        <EmptyState
          title="No bookmarks yet"
          description="Save topics you're interested in to see them here."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Bookmarks" onBack={() => router.back()} />
      {bookmarks.map((item) => (
        <Pressable
          key={item.id}
          className="mb-3"
          onPress={() => {
            router.push(`/topic/${item.topicId}`);
          }}
        >
          <AppCard>
            <AppText variant="title">{item.topic.title}</AppText>
            <AppText variant="caption" tone="secondary" className="mt-1">
              {item.chapter.title}
            </AppText>
            <View className="mt-3 flex-row gap-2">
            <AppButton
              label="Resume"
              size="sm"
              onPress={() => {
                router.push(`/topic/${item.topicId}`);
              }}
            />
            <AppButton
              label="Remove"
              variant="secondary"
              size="sm"
              onPress={async () => {
                await educationApi.deleteBookmark(item.id);
                refetch();
              }}
            />
          </View>
        </AppCard>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

