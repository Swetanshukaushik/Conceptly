import React, { useEffect } from 'react';
import { View, ScrollView, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';

import { useAppStore } from '@/store/useAppStore';
import { useHomeFeedQuery } from '@/services/api/hooks/useHomeFeedQuery';
import { educationApi } from '@/services/api/educationApi';

export default function FeedScreen() {
  const router = useRouter();
  const examType = useAppStore((s) => s.selectedExamType);
  const classId = useAppStore((s) => s.selectedClassId);
  const { data, isLoading } = useHomeFeedQuery(examType ?? undefined, examType === 'SCHOOL' ? classId ?? undefined : undefined);

  useEffect(() => {
    if (data) {
      educationApi.trackAnalyticsEvent('home_opened', {
        classLevel: classId
      });
    }
  }, [classId, data]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Home feed" subtitle="Personalized learning" />
        <Loader />
      </ScreenContainer>
    );
  }

  if (!data) {
    return (
      <ScreenContainer>
        <AppHeader title="Home feed" subtitle="Personalized learning" />
        <EmptyState
          title="No content available"
          description="Check back later for personalized learning content."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Home feed" subtitle="Personalized learning" />

      {data.continueLearning.length > 0 && (
        <View className="mb-6">
          <SectionHeader title="Continue Learning" />
          <FlatList
            scrollEnabled={false}
            data={data.continueLearning}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3"
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard>
                  <AppText variant="title">{item.title}</AppText>
                  <AppText variant="caption" tone="secondary" className="mt-1">
                    {item.reelCount} reels
                  </AppText>
                </AppCard>
              </Pressable>
            )}
          />
        </View>
      )}

      {data.recommended.length > 0 && (
        <View className="mb-6">
          <SectionHeader title="Recommended for you" />
          <FlatList
            scrollEnabled={false}
            data={data.recommended}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3"
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard>
                  <AppText variant="title">{item.title}</AppText>
                  <AppText variant="caption" tone="secondary" className="mt-1">
                    {item.reelCount} reels
                  </AppText>
                </AppCard>
              </Pressable>
            )}
          />
        </View>
      )}

      {data.quickRevision.length > 0 && (
        <View className="mb-6">
          <SectionHeader title="Quick Revision" />
          <FlatList
            scrollEnabled={false}
            data={data.quickRevision}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3"
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard>
                  <AppText variant="title">{item.title}</AppText>
                  <AppText variant="caption" tone="secondary" className="mt-1">
                    {item.reelCount} reels
                  </AppText>
                </AppCard>
              </Pressable>
            )}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

