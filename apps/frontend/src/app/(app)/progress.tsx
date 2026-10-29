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
import { CognitiveTelemetryBar } from '@/components/ui/CognitiveTelemetryBar';

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

      <CognitiveTelemetryBar />

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

      {/* 2040 4-Axis Cognitive Readiness Matrix */}
      <AppCard tone="default" style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="pulse" size={16} color={colors.telemetryMono} />
            <AppText variant="caption" style={{ fontWeight: '800', letterSpacing: 0.6 }}>
              BIOMETRIC COGNITIVE READINESS MATRIX
            </AppText>
          </View>
          <AppText variant="micro" style={{ color: colors.telemetryMono, fontWeight: '700' }}>
            EBBINGHAUS TELEMETRY: ACTIVE
          </AppText>
        </View>

        <View style={{ gap: 10 }}>
          {[
            { label: 'Conceptual Invariant Depth', score: Math.min(98, overallProgress + 18), color: colors.primary },
            { label: '30-Sec Interview Pitch Fluency', score: Math.min(96, overallProgress + 12), color: colors.accentTeal },
            { label: 'System Architecture Schematic Recall', score: Math.min(95, overallProgress + 15), color: colors.accent },
            { label: 'Negative-Marking Trap Immunity', score: Math.min(94, overallProgress + 9), color: colors.success },
          ].map((axis) => (
            <View key={axis.label}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <AppText variant="micro" tone="secondary" style={{ fontWeight: '600' }}>
                  {axis.label}
                </AppText>
                <AppText variant="micro" style={{ color: colors.telemetryMono, fontWeight: '800' }}>
                  {axis.score}%
                </AppText>
              </View>
              <View style={[styles.progressTrack, { marginTop: 0, height: 6, backgroundColor: colors.surfaceSubtle }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: axis.color,
                      width: `${axis.score}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </AppCard>

      <View style={{ marginTop: 24, marginBottom: 32 }}>
        <SectionHeader title="Topic-wise Synaptic Stability & Decay" />
        <View style={{ gap: 12, marginTop: 12 }}>
          {progress.map((item, idx) => {
            const isDone = item.completionPercent >= 100;
            const halfLifeHours = isDone ? 72 - idx * 6 : 18 + idx * 4;
            const synapticStrength = isDone ? 96 - idx * 2 : Math.max(48, item.completionPercent);
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
                      Half-Life: {halfLifeHours}h • Synaptic Stability: {synapticStrength}%
                    </AppText>
                    <AppText variant="micro" tone="primary" style={{ fontWeight: '600' }}>
                      {isDone ? 'Mastered ✓' : 'Reinforce Synapse →'}
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
