import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
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

import { useTheme } from '@/app/providers/ThemeProvider';
import { useProgressQuery } from '@/services/api/hooks/useProgressQuery';
import { educationApi } from '@/services/api/educationApi';

export default function ProgressScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
        <View style={{ paddingVertical: 80 }}>
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Learning Journey" subtitle="Track your mastery" />
        <View style={{ marginTop: 32 }}>
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
      <AppCard tone="primarySoft" style={{ marginTop: 12, marginBottom: 16 }}>
        <View style={styles.heroRow}>
          <View>
            <AppText variant="caption" tone="primary" style={{ fontWeight: '600' }}>
              Overall Curriculum Mastery
            </AppText>
            <AppText variant="hero" tone="primary" style={{ marginTop: 4 }}>
              {overallProgress}%
            </AppText>
            <AppText variant="caption" tone="secondary" style={{ marginTop: 4 }}>
              {completedTopics} of {progress.length} topics fully mastered
            </AppText>
          </View>
          <View
            style={[
              styles.trophyBadge,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
          >
            <Icon name="trophy" size={26} color={colors.textInverse} />
          </View>
        </View>
      </AppCard>

      <QuickStatsRow
        stats={[
          { label: 'Mastered', value: completedTopics.toString() },
          { label: 'In Progress', value: inProgressTopics.toString() },
          { label: 'Active Topics', value: progress.length.toString() },
        ]}
      />

      <View style={{ marginTop: 24, marginBottom: 32 }}>
        <SectionHeader title="Topic-wise Progress" />
        <View style={{ gap: 12, marginTop: 12 }}>
          {progress.map((item) => {
            const isDone = item.completionPercent >= 100;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  router.push(`/topic/${item.topicId}`);
                }}
              >
                <AppCard tone="default">
                  <View style={styles.topicHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <AppText variant="caption" tone="secondary">
                        {item.subject?.name ?? 'Subject'} • {item.chapter?.title ?? 'Chapter'}
                      </AppText>
                      <AppText variant="title" style={{ marginTop: 4 }}>
                        {item.topic?.title ?? 'Topic'}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.percentBadge,
                        {
                          backgroundColor: isDone ? colors.successSoft : colors.primarySoft,
                          borderColor: isDone ? colors.successText : colors.primaryBorder,
                        },
                      ]}
                    >
                      <AppText
                        variant="micro"
                        style={{
                          fontWeight: '700',
                          color: isDone ? colors.successText : colors.primaryText,
                        }}
                      >
                        {item.completionPercent}%
                      </AppText>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: isDone ? colors.success : colors.primary,
                          width: `${Math.min(100, Math.max(5, item.completionPercent))}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.topicFooter}>
                    <AppText variant="micro" tone="muted">
                      Difficulty: {item.topic?.difficulty ?? 'Medium'}
                    </AppText>
                    <AppText variant="micro" tone="primary" style={{ fontWeight: '600' }}>
                      {isDone ? 'Mastered ✓' : 'Tap to continue →'}
                    </AppText>
                  </View>
                </AppCard>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trophyBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  progressTrack: {
    marginTop: 12,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
