import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ConstellationGraph } from '@/components/ui/ConstellationGraph';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useChaptersBySubjectQuery } from '@/services/api/hooks/useChaptersBySubjectQuery';
import { educationApi } from '@/services/api/educationApi';
import {
  mockTopics,
  mockTopicDetails,
  mockReels,
  mockSubjectsByExamType,
  mockSubjectsByClass,
  TOPICS_WITH_REAL_REELS,
  SUBJECTS_WITH_REAL_REELS,
  EXAM_TYPES_WITH_REAL_REELS,
} from '@/services/api/mockData';

const DOMAINS = [
  { id: 'TECH_INTERVIEW', label: '💻 Tech' },
  { id: 'PM_INTERVIEW', label: '🚀 Product' },
  { id: 'FINANCE_CONSULTING', label: '📊 Finance' },
  { id: 'UPSC', label: '🏛️ UPSC' },
  { id: 'IIT_JEE', label: '📐 JEE' },
  { id: 'NEET', label: '🩺 NEET' },
  { id: 'SCHOOL', label: '🎒 Class 10' },
];

const STUDIO_MP4_TOPIC_IDS = new Set([
  'topic-moment-inertia',
  'topic-gauss-flux',
  'topic-total-internal-reflection',
  'topic-ohms-law',
]);

export default function ExploreScreen() {
  const router = useRouter();
  const selectedSubjectId = useAppStore((s) => s.selectedSubjectId) ?? 'tech-sysdesign';
  const selectedExamType = useAppStore((s) => s.selectedExamType) ?? 'TECH_INTERVIEW';
  const setExamType = useAppStore((s) => s.setExamType);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const viewMode = useAppStore((s) => s.viewMode);
  const exploreLayoutMode = useAppStore((s) => s.exploreLayoutMode);
  const setExploreLayoutMode = useAppStore((s) => s.setExploreLayoutMode);
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  const { colors } = useTheme();
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';
  const language = useAppStore((s) => s.language) ?? 'en';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyStudioHd, setOnlyStudioHd] = useState<boolean>(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string>(selectedSubjectId);
  const [activeChapterId, setActiveChapterId] = useState<string>('ALL');

  const getDifficultyStyle = (diff: string) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy' || d === 'foundational') {
      return { bg: colors.successSoft, text: colors.successText };
    }
    if (d === 'hard' || d === 'advanced') {
      return { bg: colors.dangerSoft, text: colors.dangerText };
    }
    return { bg: colors.warningSoft, text: colors.warningText };
  };

  useEffect(() => {
    if (selectedSubjectId) {
      setActiveSubjectId(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (onlyTopicsWithReels && !EXAM_TYPES_WITH_REAL_REELS.has(selectedExamType)) {
      setExamType('IIT_JEE');
      setSubjectId('jee-physics');
      setActiveSubjectId('jee-physics');
      setActiveChapterId('ALL');
    }
  }, [onlyTopicsWithReels, selectedExamType, setExamType, setSubjectId]);

  const { data: trackSubjects } = useQuery({
    queryKey: ['explore-subjects', selectedExamType, onlyTopicsWithReels],
    queryFn: async () => {
      if (selectedExamType === 'SCHOOL') {
        return educationApi.getSubjectsByClass(10);
      }
      return educationApi.getSubjectsByExamType(selectedExamType);
    },
  });

  useEffect(() => {
    if (trackSubjects && trackSubjects.length > 0) {
      if (!trackSubjects.some((s) => s.id === activeSubjectId)) {
        setActiveSubjectId(trackSubjects[0].id);
        setSubjectId(trackSubjects[0].id);
        setActiveChapterId('ALL');
      }
    }
  }, [trackSubjects, activeSubjectId, setSubjectId]);

  const { data: chapters, isLoading: chaptersLoading } =
    useChaptersBySubjectQuery(activeSubjectId);

  useEffect(() => {
    if (
      chapters &&
      chapters.length > 0 &&
      activeChapterId !== 'ALL' &&
      !chapters.some((c) => c.id === activeChapterId)
    ) {
      setActiveChapterId('ALL');
    }
  }, [chapters, activeChapterId]);

  useEffect(() => {
    educationApi.trackAnalyticsEvent('explore_opened', {
      subjectId: activeSubjectId,
      chapterId: activeChapterId,
    });
  }, [activeSubjectId, activeChapterId]);

  const availableSubjects = useMemo(() => {
    if (trackSubjects && trackSubjects.length > 0) {
      return trackSubjects.map((s) => ({
        id: s.id,
        name: (s.label as any)?.[language] || (s.label as any)?.en || s.id,
      }));
    }

    const rawPrimary =
      selectedExamType === 'SCHOOL'
        ? (mockSubjectsByClass[10] ?? [])
        : (mockSubjectsByExamType[selectedExamType] ?? []);

    const primary = onlyTopicsWithReels
      ? rawPrimary.filter((s) => SUBJECTS_WITH_REAL_REELS.has(s.id))
      : rawPrimary;

    return primary.map((s) => ({
      id: s.id,
      name: (s.label as any)?.[language] || (s.label as any)?.en || s.id,
    }));
  }, [trackSubjects, selectedExamType, language, onlyTopicsWithReels]);

  const enrichTopic = (t: {
    id: string;
    title: string;
    difficulty: string;
    reelCount: number;
    chapterId?: string;
  }) => {
    const detail = mockTopicDetails.find((d) => d.id === t.id);
    const topicReels = mockReels.filter((r) => r.topicId === t.id);
    const firstReel = topicReels[0];
    const hasStudioMp4 =
      STUDIO_MP4_TOPIC_IDS.has(t.id) ||
      Boolean(firstReel?.videoUrl?.startsWith('/physics_reels/'));

    return {
      ...t,
      chapterId: t.chapterId ?? detail?.chapterId ?? '',
      reelCount: Math.max(t.reelCount || 0, topicReels.length, 2),
      subjectName: detail?.subject?.name ?? '',
      chapterTitle: detail?.chapter?.title ?? '',
      summary:
        detail?.cheatSheetSummary?.[0] ??
        `Master the core concepts and real-world applications of ${t.title}.`,
      firstReelId: firstReel?.id,
      hasStudioMp4,
    };
  };

  // Topics for the active subject (all modules or specific module)
  const subjectTopics = useMemo(() => {
    if (!chapters || chapters.length === 0) return [];
    const validChapterIds =
      activeChapterId === 'ALL'
        ? new Set(chapters.map((c) => c.id))
        : new Set([activeChapterId]);

    const matched = mockTopics.filter(
      (t) =>
        validChapterIds.has(t.chapterId) &&
        (!onlyTopicsWithReels || TOPICS_WITH_REAL_REELS.has(t.id))
    );
    return matched.map((t) => enrichTopic(t));
  }, [chapters, activeChapterId, onlyTopicsWithReels]);

  const isFiltering = searchQuery.trim().length > 0 || onlyStudioHd;

  const filteredResults = useMemo(() => {
    if (!isFiltering) return [];
    const q = searchQuery.toLowerCase().trim();
    const pool = mockTopicDetails.length > 0 ? mockTopicDetails : mockTopics;

    return pool
      .map((item) => enrichTopic(item))
      .filter((node) => {
        if ((onlyStudioHd || onlyTopicsWithReels) && !node.hasStudioMp4) return false;
        if (!q) return true;
        return (
          node.title.toLowerCase().includes(q) ||
          node.subjectName.toLowerCase().includes(q) ||
          node.chapterTitle.toLowerCase().includes(q) ||
          node.summary.toLowerCase().includes(q)
        );
      });
  }, [searchQuery, onlyStudioHd, onlyTopicsWithReels, isFiltering]);

  const visibleDomains = useMemo(() => {
    return onlyTopicsWithReels
      ? DOMAINS.filter((d) => EXAM_TYPES_WITH_REAL_REELS.has(d.id))
      : DOMAINS;
  }, [onlyTopicsWithReels]);

  const activeChapter = chapters?.find((c) => c.id === activeChapterId);
  const activeSubject = availableSubjects.find((s) => s.id === activeSubjectId);

  const renderTopicCard = (
    node: ReturnType<typeof enrichTopic>,
    breadcrumbMode: 'none' | 'chapter' | 'full' = 'none'
  ) => {
    const diffCol = getDifficultyStyle(node.difficulty);
    const breadcrumbText =
      breadcrumbMode === 'full'
        ? node.subjectName && node.chapterTitle
          ? `${node.subjectName} • ${node.chapterTitle}`
          : node.subjectName || node.chapterTitle
        : breadcrumbMode === 'chapter'
        ? node.chapterTitle
        : '';

    return (
      <Pressable
        key={node.id}
        onPress={() => {
          educationApi.trackAnalyticsEvent('topic_opened', { topicId: node.id });
          router.push(`/topic/${node.id}`);
        }}
        style={[
          styles.topicCard,
          isDesktop ? ({ width: 'calc(50% - 8px)' } as any) : undefined,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            {Boolean(breadcrumbText) && (
              <AppText
                variant="micro"
                tone="muted"
                style={{ fontWeight: '600', marginBottom: 4 }}
              >
                {breadcrumbText}
              </AppText>
            )}
            <AppText variant="title" style={{ fontWeight: '700', fontSize: 16 }}>
              {node.title}
            </AppText>
          </View>

          <View style={styles.badgeRow}>
            {node.hasStudioMp4 && (
              <View
                style={[
                  styles.pillBadge,
                  { backgroundColor: colors.accentSoft },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{ color: colors.accent, fontWeight: '700' }}
                >
                  🎬 HD Video
                </AppText>
              </View>
            )}
            <View style={[styles.pillBadge, { backgroundColor: diffCol.bg }]}>
              <AppText
                variant="micro"
                style={{
                  color: diffCol.text,
                  fontWeight: '700',
                  textTransform: 'capitalize',
                }}
              >
                {node.difficulty}
              </AppText>
            </View>
          </View>
        </View>

        <AppText
          variant="caption"
          tone="muted"
          numberOfLines={2}
          style={{ marginTop: 6, lineHeight: 19 }}
        >
          {node.summary}
        </AppText>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <AppText variant="micro" tone="muted">
            {node.reelCount} visual {node.reelCount === 1 ? 'reel' : 'reels'}
          </AppText>

          <View style={styles.cardActions}>
            {node.firstReelId && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  router.push(`/reel/${node.firstReelId}?topicId=${node.id}`);
                }}
                style={[
                  styles.watchButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Icon name="play" size={11} color={colors.textInverse} />
                <AppText
                  variant="micro"
                  style={{ color: colors.textInverse, fontWeight: '700' }}
                >
                  Watch Reel
                </AppText>
              </Pressable>
            )}

            <Pressable
              onPress={() => router.push(`/topic/${node.id}`)}
              style={[
                styles.notesButton,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <AppText
                variant="micro"
                style={{ color: colors.textPrimary, fontWeight: '600' }}
              >
                Read Notes →
              </AppText>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer scroll>
      <AppHeader
        title="Explore"
        subtitle="Browse topics, visual reels, and interactive notes"
        fallbackRoute="/feed"
        onBack={
          !isDesktop
            ? () => {
                if (isFiltering) {
                  setSearchQuery('');
                  setOnlyStudioHd(false);
                } else {
                  router.back();
                }
              }
            : undefined
        }
      />

      {/* 1. Search Bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.surface,
            borderColor: searchQuery.trim() ? colors.primary : colors.border,
          },
        ]}
      >
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search any topic (e.g. Gauss's Law, CAP Theorem, Ohm's Law)..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: colors.textPrimary }]}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* 2. Domain Strip + Studio HD Quick Filter */}
      <View style={styles.stripWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.domainStrip}
        >
          <Pressable
            onPress={() => setOnlyStudioHd((prev) => !prev)}
            style={[
              styles.domainPill,
              {
                backgroundColor: onlyStudioHd ? colors.accent : colors.surface,
                borderColor: onlyStudioHd ? colors.accent : colors.border,
              },
            ]}
          >
            <AppText
              variant="caption"
              style={{
                fontWeight: '700',
                color: onlyStudioHd ? colors.textInverse : colors.accent,
              }}
            >
              🎬 Physics HD Reels
            </AppText>
          </Pressable>

          {visibleDomains.map((dm) => {
            const isSelected = !onlyStudioHd && selectedExamType === dm.id;
            return (
              <Pressable
                key={dm.id}
                onPress={() => {
                  setOnlyStudioHd(false);
                  setExamType(dm.id);
                  setActiveChapterId('ALL');
                  const rawSubs =
                    dm.id === 'SCHOOL'
                      ? mockSubjectsByClass[10]
                      : mockSubjectsByExamType[dm.id];
                  const domainSubs = onlyTopicsWithReels
                    ? (rawSubs ?? []).filter((s) => SUBJECTS_WITH_REAL_REELS.has(s.id))
                    : rawSubs;
                  if (domainSubs && domainSubs.length > 0) {
                    setActiveSubjectId(domainSubs[0].id);
                    setSubjectId(domainSubs[0].id);
                  }
                }}
                style={[
                  styles.domainPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  style={{
                    fontWeight: '600',
                    color: isSelected ? colors.textInverse : colors.textPrimary,
                  }}
                >
                  {dm.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. If Search or Studio HD Filter is Active */}
      {isFiltering ? (
        <View className="mt-2 mb-8">
          <View style={styles.resultsTopRow}>
            <AppText variant="h3">
              {onlyStudioHd && !searchQuery.trim()
                ? `Physics Studio HD Topics (${filteredResults.length})`
                : `Results (${filteredResults.length})`}
            </AppText>
            <Pressable
              onPress={() => {
                setSearchQuery('');
                setOnlyStudioHd(false);
              }}
            >
              <AppText
                variant="caption"
                style={{ color: colors.primaryText, fontWeight: '700' }}
              >
                Clear filter
              </AppText>
            </Pressable>
          </View>

          {filteredResults.length === 0 ? (
            <EmptyState
              title="No matching topics"
              description="Try searching for 'Gauss', 'Rotational', 'CAP', 'TIR', or 'Ohm'."
            />
          ) : (
            <View
              className={
                isDesktop ? 'flex-row flex-wrap gap-4 mt-2' : 'gap-3 mt-2'
              }
            >
              {filteredResults.map((node) => renderTopicCard(node, 'full'))}
            </View>
          )}
        </View>
      ) : (
        /* 4. Normal Clean Subject & Module View */
        <>
          {/* Subject Tabs */}
          <View style={styles.stripWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={styles.subjectStrip}
            >
              {availableSubjects.map((subject) => {
                const isSelected = activeSubjectId === subject.id;
                return (
                  <Pressable
                    key={subject.id}
                    onPress={() => {
                      setActiveSubjectId(subject.id);
                      setSubjectId(subject.id);
                      setActiveChapterId('ALL');
                    }}
                    style={[
                      styles.subjectTab,
                      {
                        backgroundColor: isSelected
                          ? colors.primarySoft
                          : colors.surface,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={{
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected
                          ? colors.primaryText
                          : colors.textSecondary,
                      }}
                    >
                      {subject.name}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Compact Chapter Pills */}
          {chaptersLoading ? (
            <View className="py-8">
              <Loader />
            </View>
          ) : (
            chapters &&
            chapters.length > 0 && (
              <View style={styles.stripWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flexGrow: 0 }}
                  contentContainerStyle={styles.chapterPillsRow}
                >
                  <Pressable
                    onPress={() => setActiveChapterId('ALL')}
                    style={[
                      styles.chapterPill,
                      {
                        backgroundColor:
                          activeChapterId === 'ALL'
                            ? colors.textPrimary
                            : colors.surfaceSubtle,
                      },
                    ]}
                  >
                    <AppText
                      variant="micro"
                      style={{
                        fontWeight: '700',
                        color:
                          activeChapterId === 'ALL'
                            ? colors.textInverse
                            : colors.textSecondary,
                      }}
                    >
                      All Modules
                    </AppText>
                  </Pressable>

                  {chapters.map((chap) => {
                    const isSelected = activeChapterId === chap.id;
                    const title =
                      typeof chap.title === 'object'
                        ? (chap.title[language] ?? chap.title.en)
                        : chap.title;
                    return (
                      <Pressable
                        key={chap.id}
                        onPress={() => setActiveChapterId(chap.id)}
                        style={[
                          styles.chapterPill,
                          {
                            backgroundColor: isSelected
                              ? colors.textPrimary
                              : colors.surfaceSubtle,
                          },
                        ]}
                      >
                        <AppText
                          variant="micro"
                          style={{
                            fontWeight: '600',
                            color: isSelected
                              ? colors.textInverse
                              : colors.textSecondary,
                          }}
                        >
                          {title}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )
          )}

          {/* Section Title + Cards/Path View Switcher */}
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <AppText variant="h3" numberOfLines={1}>
                {activeChapterId === 'ALL'
                  ? (activeSubject?.name ?? 'All Topics')
                  : activeChapter
                  ? typeof activeChapter.title === 'object'
                    ? (activeChapter.title[language] ?? activeChapter.title.en)
                    : activeChapter.title
                  : 'Topics'}
              </AppText>
              <AppText variant="micro" tone="muted">
                {subjectTopics.length}{' '}
                {subjectTopics.length === 1 ? 'topic' : 'topics'} available
              </AppText>
            </View>

            <View
              style={[
                styles.viewToggle,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                onPress={() => setExploreLayoutMode('grid')}
                style={[
                  styles.viewToggleBtn,
                  {
                    backgroundColor:
                      exploreLayoutMode === 'grid'
                        ? colors.primary
                        : 'transparent',
                  },
                ]}
              >
                <Icon
                  name="grid-outline"
                  size={13}
                  color={
                    exploreLayoutMode === 'grid'
                      ? colors.textInverse
                      : colors.textSecondary
                  }
                />
                <AppText
                  variant="micro"
                  style={{
                    fontWeight: '700',
                    color:
                      exploreLayoutMode === 'grid'
                        ? colors.textInverse
                        : colors.textSecondary,
                  }}
                >
                  Cards
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => setExploreLayoutMode('constellation')}
                style={[
                  styles.viewToggleBtn,
                  {
                    backgroundColor:
                      exploreLayoutMode === 'constellation'
                        ? colors.primary
                        : 'transparent',
                  },
                ]}
              >
                <Icon
                  name="git-network"
                  size={13}
                  color={
                    exploreLayoutMode === 'constellation'
                      ? colors.textInverse
                      : colors.textSecondary
                  }
                />
                <AppText
                  variant="micro"
                  style={{
                    fontWeight: '700',
                    color:
                      exploreLayoutMode === 'constellation'
                        ? colors.textInverse
                        : colors.textSecondary,
                  }}
                >
                  Path
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Topic Cards or Clean Learning Path */}
          <View className="mt-1 mb-8">
            { subjectTopics.length === 0 ? (
              <EmptyState
                title="No topics in this module"
                description="Select another module above to view visual lessons."
              />
            ) : exploreLayoutMode === 'constellation' ? (
              <ConstellationGraph
                topics={subjectTopics}
                chapterTitle={
                  activeChapterId === 'ALL'
                    ? (activeSubject?.name ?? 'Learning Path')
                    : activeChapter
                    ? typeof activeChapter.title === 'object'
                      ? (activeChapter.title[language] ?? activeChapter.title.en)
                      : activeChapter.title
                    : 'Learning Path'
                }
              />
            ) : (
              <View
                className={
                  isDesktop ? 'flex-row flex-wrap gap-4' : 'gap-3'
                }
              >
                {subjectTopics.map((node) =>
                  renderTopicCard(
                    node,
                    activeChapterId === 'ALL' ? 'chapter' : 'none'
                  )
                )}
              </View>
            )}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  stripWrapper: {
    marginBottom: 10,
  },
  domainStrip: {
    gap: 8,
    alignItems: 'center',
  },
  domainPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  subjectStrip: {
    gap: 8,
    alignItems: 'center',
  },
  subjectTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chapterPillsRow: {
    gap: 6,
    alignItems: 'center',
  },
  chapterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 10,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    gap: 2,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resultsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topicCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  notesButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
});
