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
import { Icon } from '@/components/ui/Icon';

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

  const completedTopics = progress?.filter((p) => p.completionPercent >= 100).length || 0;
  const inProgressTopics = progress?.filter((p) => p.completionPercent > 0 && p.completionPercent < 100).length || 0;

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Learning Journey" subtitle="Track your mastery" />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Learning Journey" subtitle="Track your mastery" />
        <View className="mt-8">
          <EmptyState
            title="No progress yet"
            description="Start watching educational reels and taking quizzes to track your mastery here."
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Learning Journey" subtitle="Track your mastery" />

      {/* Main Overall Progress Card */}
      <AppCard tone="primarySoft" className="mt-4 mb-4 border-indigo-100">
        <View className="flex-row items-center justify-between">
          <View>
            <AppText variant="caption" tone="primary">Overall Curriculum Mastery</AppText>
            <AppText variant="hero" className="text-indigo-600 mt-1">{overallProgress}%</AppText>
            <AppText variant="caption" tone="secondary" className="mt-1">
              {completedTopics} of {progress.length} topics fully mastered
            </AppText>
          </View>
          <View className="h-16 w-16 rounded-full bg-indigo-600 items-center justify-center shadow-md">
            <Icon name="trophy" size={28} color="#FFFFFF" />
          </View>
        </View>
      </AppCard>

      <QuickStatsRow
        stats={[
          { label: 'Mastered', value: completedTopics.toString() },
          { label: 'In Progress', value: inProgressTopics.toString() },
          { label: 'Active Topics', value: progress.length.toString() }
        ]}
      />

      <View className="mt-6 mb-8">
        <SectionHeader title="Topic-wise Progress" />
        <View className="gap-3 mt-3">
          {progress.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                router.push(`/topic/${item.topicId}`);
              }}
            >
              <AppCard tone="default" className="border-slate-200">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-2">
                    <AppText variant="caption" tone="secondary">
                      {item.subject?.name ?? 'Subject'} • {item.chapter?.title ?? 'Chapter'}
                    </AppText>
                    <AppText variant="title" className="mt-1">
                      {item.topic?.title ?? 'Topic'}
                    </AppText>
                  </View>
                  <View
                    className={`px-2.5 py-1 rounded-full ${
                      item.completionPercent >= 100
                        ? 'bg-green-100'
                        : item.completionPercent > 50
                        ? 'bg-indigo-100'
                        : 'bg-amber-100'
                    }`}
                  >
                    <AppText
                      variant="micro"
                      tone={
                        item.completionPercent >= 100
                          ? 'success'
                          : item.completionPercent > 50
                          ? 'primary'
                          : 'default'
                      }
                      className="font-bold"
                    >
                      {item.completionPercent}%
                    </AppText>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mt-3 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      item.completionPercent >= 100 ? 'bg-green-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, item.completionPercent))}%` }}
                  />
                </View>

                <View className="flex-row items-center justify-between mt-2">
                  <AppText variant="micro" tone="muted">
                    {item.completionPercent >= 100 ? 'Completed & Passed' : 'In Progress'}
                  </AppText>
                  <AppText variant="micro" tone="primary" className="font-semibold">
                    Review Topic →
                  </AppText>
                </View>
              </AppCard>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
