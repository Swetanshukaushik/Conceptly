import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { QuickStatsRow } from '@/components/patterns/QuickStatsRow';

import { useProgressQuery } from '@/services/api/hooks/useProgressQuery';
import { educationApi } from '@/services/api/educationApi';

export default function ProgressScreen() {
  const router = useRouter();
  const { data: progress, isLoading } = useProgressQuery();

  useEffect(() => {
    educationApi.trackAnalyticsEvent('progress_viewed');
  }, []);

  const overallProgress =
    progress && progress.length > 0
      ? Math.round(
          progress.reduce((sum: number, p) => sum + p.completionPercent, 0) / progress.length
        )
      : 0;

  const completedTopics = progress?.filter(p => p.completionPercent >= 100).length || 0;
  const inProgressTopics = progress?.filter(p => p.completionPercent > 0 && p.completionPercent < 100).length || 0;

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Progress" onBack={() => router.back()} />
        <Loader />
      </ScreenContainer>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Progress" onBack={() => router.back()} />
        <EmptyState
          title="No progress yet"
          description="Start learning to see your progress here."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Progress" onBack={() => router.back()} />

      <AppCard tone="primarySoft" className="mb-6">
        <AppText variant="caption" tone="primary">Overall Progress</AppText>
        <AppText variant="hero" className="mt-2">{overallProgress}%</AppText>
        <AppText variant="body" tone="secondary" className="mt-1">
          {progress.length} topics started
        </AppText>
      </AppCard>

      <QuickStatsRow
        stats={[
          { label: 'Completed', value: completedTopics.toString() },
          { label: 'In Progress', value: inProgressTopics.toString() },
          { label: 'Total', value: progress.length.toString() }
        ]}
      />

      <View className="mt-6">
        <SectionHeader title="Topic Progress" />
        {progress.map((item) => (
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
              <View className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
              <View
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${item.completionPercent}%` }}
              />
            </View>
            <AppText variant="micro" tone="muted" className="mt-2">
              {item.completionPercent}% complete
            </AppText>
          </AppCard>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

