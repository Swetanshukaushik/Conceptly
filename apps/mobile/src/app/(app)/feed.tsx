import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { AppHeader } from '@/components/ui/AppHeader';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';

import { useAppStore } from '@/store/useAppStore';
import { useHomeFeedQuery } from '@/services/api/hooks/useHomeFeedQuery';
import { educationApi } from '@/services/api/educationApi';

export default function FeedScreen() {
  const router = useRouter();
  const examType = useAppStore((s) => s.selectedExamType);
  const classId = useAppStore((s) => s.selectedClassId);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const viewMode = useAppStore((s) => s.viewMode);
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';

  const { data, isLoading, isError, refetch } = useHomeFeedQuery(
    examType ?? undefined,
    examType === 'SCHOOL' ? classId ?? undefined : undefined
  );

  useEffect(() => {
    if (data) {
      educationApi.trackAnalyticsEvent('home_opened', {
        classLevel: classId,
        examType: examType ?? 'TECH_INTERVIEW',
      });
    }
  }, [classId, examType, data]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Conceptly" subtitle="Atomic clarity for everything" />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <AppHeader title="Conceptly" subtitle="Atomic clarity for everything" />
        <View className="mt-6">
          <ErrorState
            title="Failed to load concept feed"
            description="Could not load your topics. Tap retry."
            actionLabel="Retry"
            onPressAction={() => refetch()}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (!data) {
    return (
      <ScreenContainer>
        <AppHeader title="Conceptly" subtitle="Atomic clarity for everything" />
        <EmptyState
          title="No content available"
          description="Check back later for personalized concepts."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Conceptly" subtitle="Atomic clarity for everything" />

      {/* 🚀 Interview Speed-Run Banner */}
      <Pressable
        onPress={() => {
          const firstTopic =
            data.continueLearning[0] ||
            data.recommended[0] ||
            data.quickRevision[0];
          if (firstTopic) {
            router.push(`/topic/${firstTopic.id}`);
          } else {
            router.push('/explore');
          }
        }}
        className="mt-4 mb-2"
      >
        <AppCard tone="primarySoft" className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Icon name="flash" size={16} color="#4F46E5" />
                <AppText variant="caption" tone="primary" className="font-extrabold uppercase tracking-wide">
                  Pre-Interview Speed Run
                </AppText>
              </View>
              <AppText variant="h3" className="text-slate-900 leading-snug">
                5-Min High-Yield Visual Revision
              </AppText>
              <AppText variant="caption" tone="secondary" className="mt-1">
                Swipe through top interview questions with visual mental models.
              </AppText>
            </View>
            <View className="h-12 w-12 rounded-full bg-indigo-600 items-center justify-center shadow-md">
              <Icon name="play" size={20} color="#FFFFFF" />
            </View>
          </View>
        </AppCard>
      </Pressable>

      {/* Subject shortcuts chips */}
      {data.subjectShortcuts && data.subjectShortcuts.length > 0 && (
        <View className="mt-3 mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
          >
            {data.subjectShortcuts.map((subject) => (
              <Chip
                key={subject.id}
                label={subject.name}
                variant="soft"
                onPress={() => {
                  setSubjectId(subject.id);
                  router.push('/explore');
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Continue Learning */}
      {data.continueLearning.length > 0 && (
        <View className="mt-4 mb-6">
          <SectionHeader
            title="Continue Revising"
            actionLabel="View all"
            onPressAction={() => router.push('/explore')}
          />
          <View className={isDesktop ? "flex-row flex-wrap gap-4 mt-2" : "gap-3 mt-2"}>
            {data.continueLearning.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="default" className="border-slate-200">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                      <AppText variant="caption" tone="primary" numberOfLines={1}>
                        {item.subject?.name ?? 'Topic'} • {item.chapter?.title ?? 'Module'}
                      </AppText>
                      <AppText variant="title" className="mt-1 text-slate-900">
                        {item.title}
                      </AppText>
                    </View>
                    <View className="bg-indigo-600 px-2.5 py-1 rounded-full">
                      <AppText variant="micro" tone="inverse">
                        {item.reelCount} visual reels
                      </AppText>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2 mt-3">
                    <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                      <AppText variant="micro" tone="secondary" className="capitalize">
                        {item.difficulty}
                      </AppText>
                    </View>
                    <AppText variant="micro" tone="muted">
                      Tap to resume reels & quiz
                    </AppText>
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Recommended for you */}
      {data.recommended.length > 0 && (
        <View className="mb-6">
          <SectionHeader title="High-Frequency Topics" />
          <View className={isDesktop ? "flex-row flex-wrap gap-4 mt-2" : "gap-3 mt-2"}>
            {data.recommended.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="default" className="border-slate-200">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                      <AppText variant="caption" tone="secondary" numberOfLines={1}>
                        {item.chapter?.title ?? 'Module'}
                      </AppText>
                      <AppText variant="title" className="mt-1">
                        {item.title}
                      </AppText>
                    </View>
                    <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                      <AppText variant="micro" tone="secondary">
                        {item.reelCount} reels
                      </AppText>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                      <AppText variant="micro" tone="secondary" className="capitalize">
                        {item.difficulty}
                      </AppText>
                    </View>
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Quick Revision */}
      {data.quickRevision.length > 0 && (
        <View className="mb-8">
          <SectionHeader title="Last-Minute Cheat Sheets" />
          <View className={isDesktop ? "flex-row flex-wrap gap-4 mt-2" : "gap-3 mt-2"}>
            {data.quickRevision.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="accentSoft" className="border-violet-200">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                      <AppText variant="caption" tone="primary" numberOfLines={1}>
                        {item.chapter?.title}
                      </AppText>
                      <AppText variant="title" className="mt-1">
                        {item.title}
                      </AppText>
                    </View>
                    <View className="bg-violet-600 px-2.5 py-1 rounded-full">
                      <AppText variant="micro" tone="inverse">
                        Cram Mode
                      </AppText>
                    </View>
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
