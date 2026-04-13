import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { ReelPreviewCard } from '@/features/reels/components/ReelPreviewCard';

import { useAppStore } from '@/store/useAppStore';
import type { ReelId } from '@/types/ids';
import { getLocalizedValue } from '@/types/i18n';

import { useBookmarkedReelsQuery } from '../hooks/useBookmarkedReelsQuery';

export default function BookmarksScreen() {
  const router = useRouter();

  const bookmarked = useAppStore((s) => s.bookmarks.reelIds);
  const toggle = useAppStore((s) => s.actions.toggleReelBookmark);
  const language = useAppStore((s) => s.preferences.language);

  const reelIds = useMemo(() => Object.keys(bookmarked) as ReelId[], [bookmarked]);

  const { data, isLoading, isError, refetch } = useBookmarkedReelsQuery(reelIds);
  const reels = data ?? [];

  return (
    <Screen className="p-0">
      <AppHeader
        title="Saved"
        subtitle="Your bookmarked reels"
        onBack={() => router.replace({ pathname: '/feed' })}
      />

      <View className="flex-1 px-4 py-2">
        {reelIds.length === 0 ? (
          <EmptyState
            title="No bookmarks yet"
            description="Save reels to revisit them quickly."
          />
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Loader />
            <Text className="text-text-muted mt-3 text-sm">Loading saved…</Text>
          </View>
        ) : isError ? (
          <EmptyState
            title="Could not load bookmarks"
            description="Please try again."
            action={
              <View className="w-full">
                <PressableButton onPress={() => refetch()} label="Retry" />
              </View>
            }
          />
        ) : (
          <FlatList
            data={reels}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerClassName="pb-8"
            renderItem={({ item }) => (
              <View>
                <ReelPreviewCard
                  reelTitle={getLocalizedValue(item.title, language)}
                  thumbnailUrl={item.thumbnailUrl}
                  estimatedSeconds={item.estimatedSeconds}
                  difficulty={item.difficulty}
                  onPress={() => {
                    router.push({
                      pathname: '/topic/[topicId]/reel/[reelId]',
                      params: { topicId: item.topicId, reelId: item.id }
                    });
                  }}
                />
                <View className="mt-2">
                  <PressableButton
                    onPress={() => toggle(item.id)}
                    label="Remove"
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </Screen>
  );
}

function PressableButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Button variant="secondary" onPress={onPress} className="w-full">
      <Text className="text-text-primary text-center font-bold">{label}</Text>
    </Button>
  );
}

