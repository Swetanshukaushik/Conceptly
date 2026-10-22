import React, { useEffect } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';

import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { educationApi } from '@/services/api/educationApi';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function BookmarksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: bookmarks, isLoading, refetch } = useBookmarksQuery();
  const viewMode = useAppStore((s) => s.viewMode);
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';

  useEffect(() => {
    educationApi.trackAnalyticsEvent('bookmarks_viewed');
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Saved Lessons" subtitle="Your Bookmarked Content" />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Saved Lessons" subtitle="Your Bookmarked Content" />
        <View className="mt-8">
          <EmptyState
            title="No bookmarks yet"
            description="Save topics or lessons while learning to easily review them here anytime."
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Saved Lessons" subtitle={`${bookmarks.length} saved topics`} />

      <View className={isDesktop ? "mt-4 mb-8 flex-row flex-wrap gap-4" : "mt-4 mb-8 gap-3"}>
        {bookmarks.map((item) => (
          <Pressable
            key={item.id}
            style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
            onPress={() => {
              router.push(`/topic/${item.topicId}`);
            }}
          >
            <AppCard tone="default">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <AppText variant="caption" tone="primary" numberOfLines={1}>
                    {item.subject?.name ?? 'Subject'} • {item.chapter?.title ?? 'Chapter'}
                  </AppText>
                  <AppText variant="title" style={{ marginTop: 4, fontWeight: '700' }}>
                    {item.topic?.title ?? 'Topic'}
                  </AppText>
                </View>
                <View style={{ backgroundColor: colors.warningSoft, borderColor: colors.warning, borderWidth: 1, padding: 8, borderRadius: 999 }}>
                  <Icon name="bookmark" size={16} color={colors.warningText} />
                </View>
              </View>

              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: 12 }}>
                <View className="flex-row gap-2">
                  <AppButton
                    label="Resume Lesson"
                    size="sm"
                    variant="primary"
                    onPress={() => {
                      router.push(`/topic/${item.topicId}`);
                    }}
                  />
                  <AppButton
                    label="Remove"
                    variant="ghost"
                    size="sm"
                    onPress={async () => {
                      await educationApi.deleteBookmark(item.id);
                      refetch();
                    }}
                  />
                </View>

                {item.reelId && (
                  <Pressable
                    onPress={() => {
                      router.push(`/reel/${item.reelId}?topicId=${item.topicId}`);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: colors.primarySoft,
                      borderColor: colors.primaryBorder,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 999,
                    }}
                  >
                    <Icon name="play" size={12} color={colors.primaryText} />
                    <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                      Watch Reel
                    </AppText>
                  </Pressable>
                )}
              </View>
            </AppCard>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}
