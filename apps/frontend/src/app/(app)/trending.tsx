import React, { useState } from 'react';
import { View, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { AppHeader } from '@/components/ui/AppHeader';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { BionicText } from '@/components/ui/BionicText';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTrendingReelsQuery } from '@/services/api/hooks/useTrendingReelsQuery';
import { educationApi } from '@/services/api/educationApi';
import type {
  TrendingBadgeType,
  TrendingReelDto,
  TrendingReelSortBy,
  TrendingTimeWindow,
} from '@/services/api/types';

const SORT_TABS: Array<{ id: TrendingReelSortBy; label: string; icon: string }> = [
  { id: 'trending', label: 'Trending Now', icon: 'flame' },
  { id: 'top_grossing', label: 'Top Grossing', icon: 'trophy' },
  { id: 'most_rewatched', label: 'Most Rewatched', icon: 'repeat' },
  { id: 'community_picks', label: 'Community Picks', icon: 'heart' },
];

const TIME_WINDOWS: Array<{ id: TrendingTimeWindow; label: string }> = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'all_time', label: 'All-Time' },
];

function formatCompactNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export default function TrendingReelsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const viewMode = useAppStore((s) => s.viewMode);
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  const likedReels = useAppStore((s) => s.likedReels);
  const userBookmarks = useAppStore((s) => s.userBookmarks);
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';

  const [sortBy, setSortBy] = useState<TrendingReelSortBy>('trending');
  const [timeWindow, setTimeWindow] = useState<TrendingTimeWindow>('24h');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('ALL');

  const { data, isLoading, isError, refetch } = useTrendingReelsQuery({
    sortBy,
    timeWindow,
    examType: selectedTrackFilter === 'ALL' ? undefined : (selectedTrackFilter as any),
  });

  const getBadgeMeta = (badge: TrendingBadgeType, rank: number) => {
    switch (badge) {
      case 'TRENDING_1':
        return {
          label: rank === 1 ? '#1 TRENDING' : `TOP #${rank} VELOCITY`,
          icon: 'flame',
          bg: colors.warningSoft,
          border: colors.warning,
          text: colors.warningText,
        };
      case 'TOP_GROSSING':
        return {
          label: 'TOP GROSSING',
          icon: 'trophy',
          bg: colors.primarySoft,
          border: colors.primaryBorder,
          text: colors.primaryText,
        };
      case 'HIGH_RETENTION':
        return {
          label: 'HIGH RETENTION',
          icon: 'sparkles',
          bg: colors.successSoft,
          border: colors.success,
          text: colors.successText,
        };
      case 'RISING_FAST':
        return {
          label: 'RISING FAST',
          icon: 'trending-up',
          bg: colors.accentSoft,
          border: colors.accent,
          text: colors.primaryText,
        };
      default:
        return {
          label: 'COMMUNITY PICK',
          icon: 'heart',
          bg: colors.surfaceSubtle,
          border: colors.border,
          text: colors.textSecondary,
        };
    }
  };

  const getDifficultyStyle = (diff: string) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy' || d === 'foundational') {
      return { bg: colors.successSoft, border: colors.success, text: colors.successText };
    }
    if (d === 'hard' || d === 'advanced') {
      return { bg: colors.dangerSoft, border: colors.danger, text: colors.dangerText };
    }
    return { bg: colors.warningSoft, border: colors.warning, text: colors.warningText };
  };

  const handleToggleLike = async (item: TrendingReelDto) => {
    const currentlyLiked = Boolean(likedReels?.[item.id] ?? item.viewerState?.isLiked);
    await educationApi.engageWithReel(item.id, currentlyLiked ? 'unlike' : 'like');
    queryClient.invalidateQueries({ queryKey: ['trendingReels'] });
    queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
  };

  const handleToggleBookmark = async (item: TrendingReelDto) => {
    await educationApi.toggleBookmark(item.topicId, item.id);
    queryClient.invalidateQueries({ queryKey: ['trendingReels'] });
    queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Community Reels Feed"
          subtitle="Top-grossing & trending reels learners are watching now"
        />
        <Loader />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Community Reels Feed"
          subtitle="Top-grossing & trending reels learners are watching now"
        />
        <ErrorState
          title="Could not load community feed"
          description="Please check your connection and retry."
          actionLabel="Retry"
          onPressAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const items = data.items ?? [];
  const pulse = data.communityPulse;

  const trackOptions = onlyTopicsWithReels
    ? [
        { id: 'ALL', label: 'All Studio Reels' },
        { id: 'IIT_JEE', label: 'IIT JEE' },
        { id: 'NEET', label: 'NEET' },
        { id: 'SCHOOL', label: 'Class 10' },
      ]
    : [
        { id: 'ALL', label: 'All Tracks' },
        { id: 'IIT_JEE', label: 'IIT JEE' },
        { id: 'NEET', label: 'NEET' },
        { id: 'SCHOOL', label: 'Class 10' },
        { id: 'TECH_INTERVIEW', label: 'Tech & Systems' },
        { id: 'UPSC', label: 'UPSC' },
      ];

  return (
    <ScreenContainer scroll>
      <AppHeader
        title="Community Reels Feed"
        subtitle="Top-grossing & trending reels learners are watching now"
      />

      {/* Community Pulse Live Telemetry Banner */}
      <View style={{ marginTop: 10, marginBottom: 14 }}>
        <AppCard tone="primarySoft">
          <View style={styles.pulseHeaderRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={styles.livePillRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                <AppText
                  variant="micro"
                  tone="primary"
                  style={{ fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}
                >
                  Live Community Pulse • {pulse.activeLearnersNow} Studying Now
                </AppText>
              </View>
              <AppText variant="h3" style={{ marginTop: 6, lineHeight: 24 }}>
                Top-Grossing & Trending Concept Reels
              </AppText>
              <AppText variant="caption" tone="secondary" style={{ marginTop: 4 }}>
                Ranked in real time by completion velocity, rewatches, and peer saves across{' '}
                {items.length} high-yield reels.
              </AppText>
            </View>

            {items.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Swipe All Trending Reels"
                onPress={() => {
                  const first = items[0];
                  router.push(
                    `/reel/${first.id}?topicId=${first.topicId}&playlist=trending&sortBy=${sortBy}` as any
                  );
                }}
                style={({ pressed }) => [
                  styles.swipeAllBtn,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Icon name="play" size={16} color={colors.textInverse} />
                <AppText
                  variant="caption"
                  style={{ color: colors.textInverse, fontWeight: '800' }}
                >
                  Swipe All ({items.length})
                </AppText>
              </Pressable>
            )}
          </View>

          {/* Pulse Telemetry Metrics Strip */}
          <View
            style={[
              styles.pulseMetricsRow,
              {
                borderTopColor: colors.primaryBorder,
              },
            ]}
          >
            <View style={styles.pulseMetricBox}>
              <AppText variant="micro" tone="secondary">
                24h Reel Views
              </AppText>
              <AppText variant="title" tone="primary" style={{ marginTop: 2 }}>
                {formatCompactNumber(pulse.reelsWatchedToday)}
              </AppText>
            </View>
            <View style={[styles.pulseDivider, { backgroundColor: colors.primaryBorder }]} />
            <View style={styles.pulseMetricBox}>
              <AppText variant="micro" tone="secondary">
                Avg Completion
              </AppText>
              <AppText variant="title" tone="primary" style={{ marginTop: 2 }}>
                {pulse.avgCompletionRate}%
              </AppText>
            </View>
            <View style={[styles.pulseDivider, { backgroundColor: colors.primaryBorder }]} />
            <View style={[styles.pulseMetricBox, { flex: 1.3 }]}>
              <AppText variant="micro" tone="secondary" numberOfLines={1}>
                Hottest Subject
              </AppText>
              <AppText variant="caption" tone="primary" numberOfLines={1} style={{ marginTop: 3, fontWeight: '800' }}>
                {pulse.topTrendingSubject}
              </AppText>
            </View>
          </View>
        </AppCard>
      </View>

      {/* Sort Cohort Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {SORT_TABS.map((tab) => {
          const active = sortBy === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setSortBy(tab.id)}
              style={[
                styles.sortTab,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Icon
                name={tab.icon}
                size={14}
                color={active ? colors.textInverse : colors.textSecondary}
              />
              <AppText
                variant="caption"
                style={{
                  color: active ? colors.textInverse : colors.textPrimary,
                  fontWeight: active ? '800' : '600',
                }}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Time Window & Track Cohort Filter Row */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, alignItems: 'center' }}
        >
          {TIME_WINDOWS.map((win) => {
            const active = timeWindow === win.id;
            return (
              <Pressable
                key={win.id}
                onPress={() => setTimeWindow(win.id)}
                style={[
                  styles.windowPill,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surfaceSubtle,
                    borderColor: active ? colors.primaryBorder : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{
                    color: active ? colors.primaryText : colors.textSecondary,
                    fontWeight: active ? '800' : '600',
                  }}
                >
                  {win.label}
                </AppText>
              </Pressable>
            );
          })}

          <View style={[styles.filterDot, { backgroundColor: colors.border }]} />

          {trackOptions.map((track) => {
            const active = selectedTrackFilter === track.id;
            return (
              <Pressable
                key={track.id}
                onPress={() => setSelectedTrackFilter(track.id)}
                style={[
                  styles.windowPill,
                  {
                    backgroundColor: active ? colors.accentSoft : colors.surface,
                    borderColor: active ? colors.primaryBorder : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{
                    color: active ? colors.primaryText : colors.textSecondary,
                    fontWeight: active ? '800' : '600',
                  }}
                >
                  {track.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Ranked Community Reels List / Grid */}
      {items.length === 0 ? (
        <EmptyState
          title="No reels in this cohort yet"
          description="Switch the track filter to All Studio Reels to see trending community reels."
          actionLabel="Show All Reels"
          onPressAction={() => setSelectedTrackFilter('ALL')}
        />
      ) : (
        <View style={[isDesktop ? styles.desktopGrid : styles.mobileList, { marginBottom: 28 }]}>
          {items.map((item) => {
            const badgeMeta = getBadgeMeta(item.badge, item.rank);
            const diffStyle = getDifficultyStyle(item.topic.difficulty);
            const isLiked = Boolean(likedReels?.[item.id] ?? item.viewerState?.isLiked);
            const isBookmarked = Boolean(
              userBookmarks?.some((b) => b.reelId === item.id || b.topicId === item.topicId) ??
                item.viewerState?.isBookmarked
            );
            const isStudioVideo = item.videoUrl.startsWith('/physics_reels/');

            return (
              <View
                key={item.id}
                style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
              >
                <AppCard tone="default">
                  {/* Top Rank & Trending Badge Row */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.rankAndBadgeRow}>
                      <View
                        style={[
                          styles.rankCircle,
                          {
                            backgroundColor:
                              item.rank <= 3 ? colors.primary : colors.surfaceSubtle,
                            borderColor:
                              item.rank <= 3 ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <AppText
                          variant="micro"
                          style={{
                            color: item.rank <= 3 ? colors.textInverse : colors.textPrimary,
                            fontWeight: '800',
                          }}
                        >
                          #{item.rank}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.badgePill,
                          {
                            backgroundColor: badgeMeta.bg,
                            borderColor: badgeMeta.border,
                          },
                        ]}
                      >
                        <Icon name={badgeMeta.icon} size={11} color={badgeMeta.text} />
                        <AppText
                          variant="micro"
                          style={{
                            color: badgeMeta.text,
                            fontWeight: '800',
                            fontSize: 10,
                          }}
                        >
                          {badgeMeta.label}
                        </AppText>
                      </View>

                      {isStudioVideo && (
                        <View
                          style={[
                            styles.badgePill,
                            {
                              backgroundColor: colors.primarySoft,
                              borderColor: colors.primaryBorder,
                            },
                          ]}
                        >
                          <Icon name="videocam" size={11} color={colors.primaryText} />
                          <AppText
                            variant="micro"
                            style={{
                              color: colors.primaryText,
                              fontWeight: '800',
                              fontSize: 10,
                            }}
                          >
                            STUDIO MP4
                          </AppText>
                        </View>
                      )}
                    </View>

                    <View
                      style={[
                        styles.velocityPill,
                        {
                          backgroundColor: colors.successSoft,
                          borderColor: colors.success,
                        },
                      ]}
                    >
                      <Icon name="trending-up" size={11} color={colors.successText} />
                      <AppText
                        variant="micro"
                        style={{ color: colors.successText, fontWeight: '800', fontSize: 10 }}
                      >
                        +{item.metrics.velocityDeltaPercent}%
                      </AppText>
                    </View>
                  </View>

                  {/* Subject / Chapter / Duration Breadcrumb */}
                  <View style={styles.metaBreadcrumbRow}>
                    <AppText variant="caption" tone="primary" numberOfLines={1} style={{ flex: 1, fontWeight: '700' }}>
                      {item.subject.name} • {item.chapter.title}
                    </AppText>
                    <View style={styles.durationRow}>
                      <View
                        style={[
                          styles.diffBadge,
                          { backgroundColor: diffStyle.bg, borderColor: diffStyle.border },
                        ]}
                      >
                        <AppText
                          variant="micro"
                          style={{
                            color: diffStyle.text,
                            fontWeight: '700',
                            textTransform: 'capitalize',
                            fontSize: 10,
                          }}
                        >
                          {item.topic.difficulty}
                        </AppText>
                      </View>
                      <AppText variant="micro" tone="muted" style={{ fontWeight: '700' }}>
                        {item.durationSec}s
                      </AppText>
                    </View>
                  </View>

                  {/* Reel Title & Key Takeaway */}
                  <Pressable
                    onPress={() =>
                      router.push(
                        `/reel/${item.id}?topicId=${item.topicId}&playlist=trending&sortBy=${sortBy}` as any
                      )
                    }
                    style={{ marginTop: 6 }}
                  >
                    <AppText variant="title" style={{ lineHeight: 22 }}>
                      {item.title}
                    </AppText>
                    {item.keyTakeaway && (
                      <BionicText
                        text={item.keyTakeaway}
                        numberOfLines={2}
                        style={{ fontSize: 12, lineHeight: 18, marginTop: 5 }}
                      />
                    )}
                  </Pressable>

                  {/* Community Student Highlight Quote */}
                  {item.communityHighlight && (
                    <View
                      style={[
                        styles.communityQuoteBox,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.quoteAuthorRow}>
                        <View style={styles.quoteAuthorLeft}>
                          <Icon name="chatbubble-ellipses" size={12} color={colors.primaryText} />
                          <AppText variant="micro" numberOfLines={1} style={{ fontWeight: '800' }}>
                            {item.communityHighlight.authorName}
                          </AppText>
                          <AppText
                            variant="micro"
                            tone="primary"
                            numberOfLines={1}
                            style={{ fontWeight: '700', flexShrink: 1 }}
                          >
                            • {item.communityHighlight.authorBadge}
                          </AppText>
                        </View>
                        <AppText variant="micro" tone="muted" style={{ fontWeight: '700' }}>
                          ▲ {item.communityHighlight.upvotesCount}
                        </AppText>
                      </View>
                      <AppText
                        variant="caption"
                        tone="secondary"
                        numberOfLines={2}
                        style={{ marginTop: 3, fontStyle: 'italic' }}
                      >
                        "{item.communityHighlight.topComment}"
                      </AppText>
                    </View>
                  )}

                  {/* Engagement Telemetry Strip */}
                  <View
                    style={[
                      styles.telemetryStrip,
                      {
                        borderTopColor: colors.border,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.telemetryItem}>
                      <Icon name="eye-outline" size={13} color={colors.textSecondary} />
                      <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
                        {formatCompactNumber(item.metrics.viewsCount)} views
                      </AppText>
                    </View>

                    <View style={styles.telemetryItem}>
                      <Icon name="checkmark-done-circle-outline" size={13} color={colors.successText} />
                      <AppText variant="micro" style={{ color: colors.successText, fontWeight: '700' }}>
                        {item.metrics.completionRate}% watched
                      </AppText>
                    </View>

                    <View style={styles.telemetryItem}>
                      <Icon name="repeat" size={13} color={colors.textSecondary} />
                      <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
                        {formatCompactNumber(item.metrics.rewatchesCount)} rewatches
                      </AppText>
                    </View>

                    <View style={styles.telemetryItem}>
                      <Icon name="people-outline" size={13} color={colors.primaryText} />
                      <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                        {item.metrics.activeLearnersNow} live
                      </AppText>
                    </View>
                  </View>

                  {/* Interactive Action Footer */}
                  <View style={styles.actionFooter}>
                    <View style={styles.leftActions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Upvote ${item.title}`}
                        onPress={() => handleToggleLike(item)}
                        style={[
                          styles.iconActionBtn,
                          {
                            backgroundColor: isLiked ? colors.primarySoft : colors.surfaceSubtle,
                            borderColor: isLiked ? colors.primaryBorder : colors.border,
                          },
                        ]}
                      >
                        <Icon
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={14}
                          color={isLiked ? colors.primaryText : colors.textSecondary}
                        />
                        <AppText
                          variant="micro"
                          style={{
                            color: isLiked ? colors.primaryText : colors.textSecondary,
                            fontWeight: '800',
                          }}
                        >
                          {formatCompactNumber(item.metrics.likesCount)}
                        </AppText>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Save ${item.title}`}
                        onPress={() => handleToggleBookmark(item)}
                        style={[
                          styles.iconActionBtn,
                          {
                            backgroundColor: isBookmarked ? colors.primarySoft : colors.surfaceSubtle,
                            borderColor: isBookmarked ? colors.primaryBorder : colors.border,
                          },
                        ]}
                      >
                        <Icon
                          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                          size={14}
                          color={isBookmarked ? colors.primaryText : colors.textSecondary}
                        />
                        <AppText
                          variant="micro"
                          style={{
                            color: isBookmarked ? colors.primaryText : colors.textSecondary,
                            fontWeight: '700',
                          }}
                        >
                          {isBookmarked ? 'Saved' : formatCompactNumber(item.metrics.bookmarksCount)}
                        </AppText>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Open Topic ${item.topic.title}`}
                        onPress={() => router.push(`/topic/${item.topicId}`)}
                        style={[
                          styles.iconActionBtn,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Icon name="book-outline" size={14} color={colors.textSecondary} />
                        <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
                          Topic
                        </AppText>
                      </Pressable>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Watch Reel ${item.title}`}
                      onPress={() =>
                        router.push(
                          `/reel/${item.id}?topicId=${item.topicId}&playlist=trending&sortBy=${sortBy}` as any
                        )
                      }
                      style={({ pressed }) => [
                        styles.watchReelBtn,
                        {
                          backgroundColor: colors.primary,
                        },
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <Icon name="play" size={13} color={colors.textInverse} />
                      <AppText
                        variant="micro"
                        style={{ color: colors.textInverse, fontWeight: '800' }}
                      >
                        Watch Reel
                      </AppText>
                    </Pressable>
                  </View>
                </AppCard>
              </View>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pulseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  livePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  swipeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  pulseMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  pulseMetricBox: {
    flex: 1,
  },
  pulseDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 10,
  },
  sortTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filtersContainer: {
    marginBottom: 14,
  },
  windowPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  mobileList: {
    gap: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 8,
  },
  rankAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  rankCircle: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  velocityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  metaBreadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  communityQuoteBox: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  quoteAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  quoteAuthorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  telemetryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  iconActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  watchReelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },
});
