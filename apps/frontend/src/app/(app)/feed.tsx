import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
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
import { CognitiveTelemetryBar } from '@/components/ui/CognitiveTelemetryBar';
import { BionicText } from '@/components/ui/BionicText';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useHomeFeedQuery } from '@/services/api/hooks/useHomeFeedQuery';
import { educationApi } from '@/services/api/educationApi';

export default function FeedScreen() {
  const router = useRouter();
  const examType = useAppStore((s) => s.selectedExamType);
  const classId = useAppStore((s) => s.selectedClassId);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const viewMode = useAppStore((s) => s.viewMode);
  const { colors, isDark } = useTheme();
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

  const getDifficultyColor = (diff: string) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy' || d === 'foundational') {
      return { bg: colors.successSoft, border: colors.success, text: colors.successText };
    }
    if (d === 'hard' || d === 'advanced') {
      return { bg: colors.dangerSoft, border: colors.danger, text: colors.dangerText };
    }
    return { bg: colors.warningSoft, border: colors.warning, text: colors.warningText };
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Conceptly Focus"
          subtitle="Atomic clarity for everything"
        />
        <Loader />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Conceptly Focus"
          subtitle="Atomic clarity for everything"
        />
        <ErrorState
          title="Failed to load study feed"
          description="Could not reach the Conceptly engine. Please verify your connection."
          actionLabel="Retry Connection"
          onPressAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const hasContent =
    data.continueLearning.length > 0 ||
    data.recommended.length > 0 ||
    data.quickRevision.length > 0;

  if (!hasContent) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Conceptly Focus"
          subtitle="Atomic clarity for everything"
        />
        <EmptyState
          title="No lessons assigned yet"
          description="Head over to Explore to browse chapters and start your visual revision."
          actionLabel="Explore Curriculum"
          onPressAction={() => router.push('/explore')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader
        title="Conceptly Focus"
        subtitle="Atomic clarity for everything"
      />

      <CognitiveTelemetryBar />

      {/* Pre-Interview Speed Run Banner */}
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
        style={{ marginTop: 12, marginBottom: 8 }}
      >
        <AppCard tone="primarySoft">
          <View style={styles.bannerRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={styles.badgeRow}>
                <Icon name="flash" size={14} color={colors.primaryText} />
                <AppText
                  variant="micro"
                  tone="primary"
                  style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700' }}
                >
                  Pre-Session Speed Run
                </AppText>
              </View>
              <AppText variant="h3" style={{ lineHeight: 24, marginTop: 4 }}>
                5-Min High-Yield Visual Revision
              </AppText>
              <AppText variant="caption" tone="secondary" style={{ marginTop: 4 }}>
                Swipe through high-frequency interview topics with visual mental models.
              </AppText>
            </View>
            <View
              style={[
                styles.playButton,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <Icon name="play" size={18} color={colors.textInverse} />
            </View>
          </View>
        </AppCard>
      </Pressable>

      {/* Subject shortcuts chips */}
      {data.subjectShortcuts && data.subjectShortcuts.length > 0 && (
        <View style={{ marginTop: 8, marginBottom: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
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

      {/* Continue Revising */}
      {data.continueLearning.length > 0 && (
        <View style={{ marginTop: 12, marginBottom: 20 }}>
          <SectionHeader
            title="Continue Revising"
            actionLabel="View all"
            onPressAction={() => router.push('/explore')}
          />
          <View style={isDesktop ? styles.desktopGrid : styles.mobileList}>
            {data.continueLearning.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="default">
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <AppText variant="caption" tone="primary" numberOfLines={1}>
                        {item.subject?.name ?? 'Topic'} • {item.chapter?.title ?? 'Module'}
                      </AppText>
                      <AppText variant="title" style={{ marginTop: 4 }}>
                        {item.title}
                      </AppText>
                      {(item as any).cheatSheetSummary?.[0] && (
                        <BionicText
                          text={(item as any).cheatSheetSummary[0]}
                          numberOfLines={2}
                          style={{ fontSize: 12, lineHeight: 17, marginTop: 6 }}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        styles.reelPill,
                        {
                          backgroundColor: colors.primarySoft,
                          borderColor: colors.primaryBorder,
                        },
                      ]}
                    >
                      <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                        {item.reelCount} reels
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    {(() => {
                      const diffCol = getDifficultyColor(item.difficulty);
                      return (
                        <View
                          style={[
                            styles.diffBadge,
                            { backgroundColor: diffCol.bg, borderColor: diffCol.border },
                          ]}
                        >
                          <AppText variant="micro" style={{ textTransform: 'capitalize', color: diffCol.text, fontWeight: '700' }}>
                            {item.difficulty}
                          </AppText>
                        </View>
                      );
                    })()}
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
        <View style={{ marginBottom: 20 }}>
          <SectionHeader title="High-Frequency Topics" />
          <View style={isDesktop ? styles.desktopGrid : styles.mobileList}>
            {data.recommended.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="default">
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <AppText variant="caption" tone="secondary" numberOfLines={1}>
                        {item.chapter?.title ?? 'Module'}
                      </AppText>
                      <AppText variant="title" style={{ marginTop: 4 }}>
                        {item.title}
                      </AppText>
                      {(item as any).cheatSheetSummary?.[0] && (
                        <BionicText
                          text={(item as any).cheatSheetSummary[0]}
                          numberOfLines={2}
                          style={{ fontSize: 12, lineHeight: 17, marginTop: 6 }}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        styles.reelPill,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <AppText variant="micro" tone="secondary">
                        {item.reelCount} reels
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    {(() => {
                      const diffCol = getDifficultyColor(item.difficulty);
                      return (
                        <View
                          style={[
                            styles.diffBadge,
                            { backgroundColor: diffCol.bg, borderColor: diffCol.border },
                          ]}
                        >
                          <AppText variant="micro" style={{ textTransform: 'capitalize', color: diffCol.text, fontWeight: '700' }}>
                            {item.difficulty}
                          </AppText>
                        </View>
                      );
                    })()}
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Quick Revision */}
      {data.quickRevision.length > 0 && (
        <View style={{ marginBottom: 28 }}>
          <SectionHeader title="Last-Minute Cheat Sheets" />
          <View style={isDesktop ? styles.desktopGrid : styles.mobileList}>
            {data.quickRevision.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                onPress={() => {
                  router.push(`/topic/${item.id}`);
                }}
              >
                <AppCard tone="accentSoft">
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <AppText variant="caption" tone="primary" numberOfLines={1}>
                        {item.chapter?.title}
                      </AppText>
                      <AppText variant="title" style={{ marginTop: 4 }}>
                        {item.title}
                      </AppText>
                      {(item as any).cheatSheetSummary?.[0] && (
                        <BionicText
                          text={(item as any).cheatSheetSummary[0]}
                          numberOfLines={2}
                          style={{ fontSize: 12, lineHeight: 17, marginTop: 6 }}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        styles.reelPill,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <AppText variant="micro" tone="secondary">
                        Summary
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

const styles = StyleSheet.create({
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  mobileList: {
    gap: 12,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reelPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
});
