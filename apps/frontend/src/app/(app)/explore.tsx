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
import { BionicText } from '@/components/ui/BionicText';
import { CognitiveTelemetryBar } from '@/components/ui/CognitiveTelemetryBar';
import { ConstellationGraph } from '@/components/ui/ConstellationGraph';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useChaptersBySubjectQuery } from '@/services/api/hooks/useChaptersBySubjectQuery';
import { useTopicsByChapterQuery } from '@/services/api/hooks/useTopicsByChapterQuery';
import { educationApi } from '@/services/api/educationApi';
import {
  mockTopics,
  mockTopicDetails,
  mockReels,
  mockSubjectsByExamType,
  mockSubjectsByClass,
} from '@/services/api/mockData';

type FilterLens = 'all' | 'studio_hd' | 'hard' | 'in_progress';

const DOMAIN_SECTORS = [
  { id: 'TECH_INTERVIEW', code: 'SEC-01', label: 'Tech & Arch', icon: '💻', tag: '4 TRACKS' },
  { id: 'PM_INTERVIEW', code: 'SEC-02', label: 'Product Mgmt', icon: '🚀', tag: '3 TRACKS' },
  { id: 'FINANCE_CONSULTING', code: 'SEC-03', label: 'Finance & Case', icon: '📊', tag: '2 TRACKS' },
  { id: 'UPSC', code: 'SEC-04', label: 'UPSC Civil', icon: '🏛️', tag: '3 TRACKS' },
  { id: 'IIT_JEE', code: 'SEC-05', label: 'IIT-JEE Core', icon: '📐', tag: 'STUDIO HD' },
  { id: 'NEET', code: 'SEC-06', label: 'NEET Medical', icon: '🩺', tag: 'STUDIO HD' },
  { id: 'SCHOOL', code: 'SEC-07', label: 'Class 10 STEM', icon: '🎒', tag: 'STUDIO HD' },
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
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const userProgress = useAppStore((s) => s.userProgress);
  const { colors } = useTheme();
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';
  const language = useAppStore((s) => s.language) ?? 'en';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLens, setActiveLens] = useState<FilterLens>('all');
  const [showStudioShelf, setShowStudioShelf] = useState<boolean>(true);
  const [activeSubjectId, setActiveSubjectId] = useState<string>(selectedSubjectId);
  const [activeChapterId, setActiveChapterId] = useState<string>('');

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

  useEffect(() => {
    if (selectedSubjectId) {
      setActiveSubjectId(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  const { data: trackSubjects } = useQuery({
    queryKey: ['explore-subjects', selectedExamType],
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
      }
    }
  }, [trackSubjects, activeSubjectId, setSubjectId]);

  const { data: chapters, isLoading: chaptersLoading } =
    useChaptersBySubjectQuery(activeSubjectId);

  useEffect(() => {
    if (
      chapters &&
      chapters.length > 0 &&
      (!activeChapterId || !chapters.some((c) => c.id === activeChapterId))
    ) {
      setActiveChapterId(chapters[0].id);
    }
  }, [chapters, activeChapterId]);

  const { data: topics, isLoading: topicsLoading } = useTopicsByChapterQuery(
    activeChapterId || ''
  );

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

    const primary =
      selectedExamType === 'SCHOOL'
        ? (mockSubjectsByClass[10] ?? [])
        : (mockSubjectsByExamType[selectedExamType] ?? []);

    return primary.map((s) => ({
      id: s.id,
      name: (s.label as any)?.[language] || (s.label as any)?.en || s.id,
    }));
  }, [trackSubjects, selectedExamType, language]);

  // 8 Studio-Rendered 45s Physics Reels
  const studioPhysicsStreams = useMemo(() => {
    return mockReels.filter((r) => r.videoUrl.startsWith('/physics_reels/'));
  }, []);

  // Enrich any topic DTO with full 2040 telemetry, mental model, completion, and first reel ID
  const enrichTopicNode = (t: { id: string; title: string; difficulty: string; reelCount: number }, idx: number) => {
    const detail = mockTopicDetails.find((d) => d.id === t.id);
    const prog = userProgress.find((p) => p.topicId === t.id);
    const completion =
      prog?.completionPercent ?? (idx === 0 ? 100 : idx === 1 ? 65 : 20);
    const firstReel = mockReels.find((r) => r.topicId === t.id);
    const hasStudioMp4 =
      STUDIO_MP4_TOPIC_IDS.has(t.id) ||
      Boolean(firstReel?.videoUrl?.startsWith('/physics_reels/'));

    return {
      ...t,
      coordinate: `VEC-${String(idx + 1).padStart(2, '0')}.40`,
      subjectName: detail?.subject?.name ?? 'Core Track',
      chapterTitle: detail?.chapter?.title ?? 'Module',
      mentalModel:
        detail?.cheatSheetSummary?.[0] ??
        `Master the core architectural invariants and high-yield applications of ${t.title}.`,
      secondaryBullet: detail?.cheatSheetSummary?.[1] ?? null,
      completion,
      firstReelId: firstReel?.id,
      hasStudioMp4,
    };
  };

  // Global cross-domain semantic search + cognitive lens filtering
  const isGlobalFilterActive =
    searchQuery.trim().length > 0 || activeLens !== 'all';

  const globalFilteredNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const basePool = mockTopicDetails.length > 0 ? mockTopicDetails : mockTopics;

    return basePool
      .map((item, index) => enrichTopicNode(item, index))
      .filter((node) => {
        if (activeLens === 'studio_hd' && !node.hasStudioMp4) return false;
        if (
          activeLens === 'hard' &&
          node.difficulty.toLowerCase() !== 'hard' &&
          node.difficulty.toLowerCase() !== 'advanced'
        ) {
          return false;
        }
        if (activeLens === 'in_progress') {
          const inProg = userProgress.some((p) => p.topicId === node.id);
          if (!inProg && node.completion < 50) return false;
        }

        if (!q) return true;
        return (
          node.title.toLowerCase().includes(q) ||
          node.difficulty.toLowerCase().includes(q) ||
          node.subjectName.toLowerCase().includes(q) ||
          node.chapterTitle.toLowerCase().includes(q) ||
          node.mentalModel.toLowerCase().includes(q)
        );
      });
  }, [searchQuery, activeLens, userProgress]);

  const activeChapter = chapters?.find((c) => c.id === activeChapterId);
  const activeSubject = availableSubjects.find((s) => s.id === activeSubjectId);

  const enrichedModuleTopics = useMemo(() => {
    if (!topics) return [];
    return topics.map((t, idx) => enrichTopicNode(t, idx));
  }, [topics, userProgress]);

  const renderHolographicNodeCard = (
    node: ReturnType<typeof enrichTopicNode>,
    showDomainTag = false
  ) => {
    const diffCol = getDifficultyColor(node.difficulty);
    const statusColor =
      node.completion >= 100
        ? colors.success
        : node.completion >= 50
        ? colors.primary
        : colors.accent;

    return (
      <View
        key={node.id}
        style={[
          styles.holoCard,
          isDesktop ? ({ width: 'calc(50% - 8px)' } as any) : undefined,
          {
            backgroundColor: colors.surface,
            borderColor: node.hasStudioMp4 ? colors.accent : colors.border,
            borderTopColor: node.hasStudioMp4 ? colors.accent : colors.borderSpecular,
          },
        ]}
      >
        {/* Top Vector & Telemetry Strip */}
        <View style={styles.holoTopRow}>
          <View style={styles.holoCoordRow}>
            <View style={[styles.holoPulseDot, { backgroundColor: statusColor }]} />
            <AppText
              variant="micro"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                color: colors.telemetryMono,
                fontWeight: '800',
              }}
            >
              {node.coordinate}
            </AppText>
            {showDomainTag && (
              <View
                style={[
                  styles.domainTagPill,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{ color: colors.textSecondary, fontWeight: '700' }}
                >
                  {node.subjectName}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.holoBadgesRight}>
            {node.hasStudioMp4 && (
              <View
                style={[
                  styles.studioChip,
                  { backgroundColor: colors.accentSoft, borderColor: colors.accent },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{
                    color: colors.accent,
                    fontWeight: '900',
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  }}
                >
                  🎬 STUDIO 45s MP4
                </AppText>
              </View>
            )}
            <View
              style={[
                styles.diffChip,
                { backgroundColor: diffCol.bg, borderColor: diffCol.border },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  textTransform: 'uppercase',
                  color: diffCol.text,
                  fontWeight: '800',
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                }}
              >
                {node.difficulty}
              </AppText>
            </View>
          </View>
        </View>

        {/* Node Title */}
        <Pressable
          onPress={() => {
            educationApi.trackAnalyticsEvent('topic_opened', { topicId: node.id });
            router.push(`/topic/${node.id}`);
          }}
        >
          <AppText
            variant="title"
            style={{ fontWeight: '800', fontSize: 16, marginTop: 6, marginBottom: 6 }}
          >
            {node.title}
          </AppText>

          {/* 1-Sentence Mental Model Preview with Bionic Reading */}
          <BionicText
            text={node.mentalModel}
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: colors.textSecondary,
              marginBottom: 10,
            }}
          />
        </Pressable>

        {/* Synaptic Sync Telemetry Bar */}
        <View style={styles.syncBarContainer}>
          <View
            style={[
              styles.syncTrack,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.syncFill,
                {
                  width: `${Math.max(10, node.completion)}%` as any,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          <AppText
            variant="micro"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
              color: colors.telemetryMono,
              fontWeight: '800',
            }}
          >
            {node.completion}% SYNC
          </AppText>
        </View>

        {/* Capability Pills + Dual Action Buttons */}
        <View
          style={[
            styles.holoFooter,
            { borderTopColor: colors.border },
          ]}
        >
          <View style={styles.capPillsRow}>
            <View
              style={[
                styles.capPill,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  color: colors.textSecondary,
                  fontWeight: '700',
                }}
              >
                ⚡ TOPOLOGY SIM
              </AppText>
            </View>
            <View
              style={[
                styles.capPill,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  color: colors.textSecondary,
                  fontWeight: '700',
                }}
              >
                🎞️ {node.reelCount} REELS
              </AppText>
            </View>
          </View>

          <View style={styles.holoActionRow}>
            {node.firstReelId && (
              <Pressable
                onPress={() => {
                  educationApi.trackAnalyticsEvent('explore_stream_reel', {
                    topicId: node.id,
                    reelId: node.firstReelId,
                  });
                  router.push(`/reel/${node.firstReelId}?topicId=${node.id}`);
                }}
                style={[
                  styles.streamActionBtn,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Icon name="play" size={12} color={colors.textInverse} />
                <AppText
                  variant="micro"
                  style={{ color: colors.textInverse, fontWeight: '800' }}
                >
                  Stream 45s
                </AppText>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                educationApi.trackAnalyticsEvent('topic_opened', { topicId: node.id });
                router.push(`/topic/${node.id}`);
              }}
              style={[
                styles.nodeActionBtn,
                {
                  backgroundColor: colors.primarySoft,
                  borderColor: colors.primaryBorder,
                },
              ]}
            >
              <AppText
                variant="micro"
                style={{ color: colors.primaryText, fontWeight: '800' }}
              >
                Open Node →
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/quiz/${node.id}`)}
              style={[
                styles.quizIconBtn,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="help-circle-outline" size={15} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer scroll>
      <AppHeader
        title="2040 Neural Explorer"
        subtitle="Spatial Knowledge Matrix & Studio Reel Index"
      />

      <CognitiveTelemetryBar />

      {/* ===================================================================== */}
      {/* 1. 2040 NEURAL VECTOR SEARCH & FILTER LENS COMMAND DECK               */}
      {/* ===================================================================== */}
      <View
        style={[
          styles.commandDeckCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderTopColor: colors.borderSpecular,
          },
        ]}
      >
        <View style={styles.commandDeckTopBar}>
          <View style={styles.commandTitleCluster}>
            <View
              style={[
                styles.liveBeaconDot,
                { backgroundColor: colors.telemetryMono },
              ]}
            />
            <AppText
              variant="micro"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                color: colors.telemetryMono,
                fontWeight: '800',
                letterSpacing: 0.7,
              }}
            >
              GLOBAL VECTOR INDEX // {mockTopicDetails.length} NODES • {mockReels.length} REELS
            </AppText>
          </View>

          <Pressable
            onPress={() => setCommandPaletteOpen(true)}
            style={[
              styles.omnibarTriggerPill,
              {
                backgroundColor: colors.primarySoft,
                borderColor: colors.primaryBorder,
              },
            ]}
          >
            <Icon name="terminal-outline" size={12} color={colors.primaryText} />
            <AppText
              variant="micro"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                color: colors.primaryText,
                fontWeight: '800',
              }}
            >
              ⌘K OMNIBAR
            </AppText>
          </Pressable>
        </View>

        {/* Neural Vector Search Bar */}
        <View
          style={[
            styles.neuralSearchInputBox,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor:
                searchQuery.trim().length > 0 ? colors.primary : colors.border,
            },
          ]}
        >
          <Icon name="search" size={18} color={colors.telemetryMono} />
          <TextInput
            placeholder="Query any concept, equation, or mental model (e.g. Gauss, CAP, TIR, Ohm, WACC)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.neuralTextInput,
              { color: colors.textPrimary },
            ]}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
            >
              <Icon name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* 1-Tap Cognitive Filter Lenses */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.lensStrip}
        >
          {[
            { id: 'all' as FilterLens, label: '🌐 All Sector Nodes', badge: '37' },
            {
              id: 'studio_hd' as FilterLens,
              label: '🎬 Studio HD Physics MP4',
              badge: '8 NEW',
            },
            { id: 'hard' as FilterLens, label: '🔥 High-Stakes Hard', badge: 'ADV' },
            { id: 'in_progress' as FilterLens, label: '🧠 Active Sync Orbit', badge: 'SYNC' },
          ].map((lens) => {
            const isActive = activeLens === lens.id;
            return (
              <Pressable
                key={lens.id}
                onPress={() => setActiveLens(lens.id)}
                style={[
                  styles.lensPill,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surfaceSubtle,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="micro"
                  style={{
                    fontWeight: '800',
                    color: isActive ? colors.textInverse : colors.textSecondary,
                  }}
                >
                  {lens.label}
                </AppText>
                <View
                  style={[
                    styles.lensCountBadge,
                    {
                      backgroundColor: isActive
                        ? colors.surface
                        : colors.primarySoft,
                    },
                  ]}
                >
                  <AppText
                    variant="micro"
                    style={{
                      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      fontSize: 9,
                      fontWeight: '900',
                      color: isActive ? colors.primary : colors.primaryText,
                    }}
                  >
                    {lens.badge}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ===================================================================== */}
      {/* 2. STUDIO HD NEURAL STREAMS SPOTLIGHT (8 REAL 45s PHYSICS MP4 REELS)   */}
      {/* ===================================================================== */}
      <View
        style={[
          styles.studioShelfContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderTopColor: colors.borderSpecular,
          },
        ]}
      >
        <Pressable
          onPress={() => setShowStudioShelf((prev) => !prev)}
          style={styles.studioShelfHeader}
        >
          <View style={styles.studioShelfTitleRow}>
            <View
              style={[
                styles.studioLiveTag,
                { backgroundColor: colors.accentSoft, borderColor: colors.accent },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  color: colors.accent,
                  fontWeight: '900',
                }}
              >
                🎬 STUDIO 45s MP4
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="body" style={{ fontWeight: '800' }}>
                Physics Neural Streams (1080×1920 Studio Renders)
              </AppText>
              <AppText variant="micro" tone="muted">
                8 custom-rendered 45-second physics reels with neural voiceover & schematics
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.collapseBtn,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <Icon
              name={showStudioShelf ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={colors.textSecondary}
            />
          </View>
        </Pressable>

        {showStudioShelf && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.studioCardsRow}
          >
            {studioPhysicsStreams.map((reel, idx) => (
              <Pressable
                key={reel.id}
                onPress={() => {
                  educationApi.trackAnalyticsEvent('studio_reel_spotlight_opened', {
                    reelId: reel.id,
                    topicId: reel.topicId,
                  });
                  router.push(`/reel/${reel.id}?topicId=${reel.topicId}`);
                }}
                style={[
                  styles.studioReelCard,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                    borderTopColor: colors.borderSpecular,
                  },
                ]}
              >
                <View style={styles.studioCardTop}>
                  <AppText
                    variant="micro"
                    style={{
                      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      color: colors.telemetryMono,
                      fontWeight: '800',
                    }}
                  >
                    STREAM-0{idx + 1} // 45s HD
                  </AppText>
                  <View
                    style={[
                      styles.playBadgeCircle,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Icon name="play" size={12} color={colors.textInverse} />
                  </View>
                </View>

                <AppText
                  variant="body"
                  numberOfLines={2}
                  style={{ fontWeight: '800', fontSize: 13, marginTop: 6 }}
                >
                  {reel.title}
                </AppText>

                <AppText
                  variant="micro"
                  tone="muted"
                  numberOfLines={2}
                  style={{ marginTop: 4, lineHeight: 15 }}
                >
                  {reel.keyTakeaway}
                </AppText>

                <View style={styles.studioCardFooter}>
                  <AppText
                    variant="micro"
                    style={{
                      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      color: colors.primaryText,
                      fontWeight: '800',
                    }}
                  >
                    {reel.topic.title}
                  </AppText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* ===================================================================== */}
      {/* 3. GLOBAL SEARCH / LENS RESULTS OR SPATIAL SECTOR BROWSER             */}
      {/* ===================================================================== */}
      {isGlobalFilterActive ? (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeaderRow}>
            <View>
              <AppText variant="h3">
                Neural Vector Matches ({globalFilteredNodes.length})
              </AppText>
              <AppText variant="caption" tone="muted">
                {searchQuery.trim()
                  ? `Cross-domain semantic matches for "${searchQuery}"`
                  : `Filtered by cognitive lens: ${activeLens.toUpperCase()}`}
              </AppText>
            </View>

            <Pressable
              onPress={() => {
                setSearchQuery('');
                setActiveLens('all');
              }}
              style={[
                styles.resetFilterBtn,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <Icon name="refresh" size={13} color={colors.textSecondary} />
              <AppText
                variant="micro"
                style={{ color: colors.textSecondary, fontWeight: '800' }}
              >
                Reset Matrix
              </AppText>
            </Pressable>
          </View>

          {globalFilteredNodes.length === 0 ? (
            <EmptyState
              title="No cognitive vectors matched"
              description="Try querying 'Gauss', 'Parallel Axis', 'CAP', 'TIR', 'Ohm', or 'React Fiber'."
            />
          ) : (
            <View
              className={
                isDesktop ? 'flex-row flex-wrap gap-4 mt-2' : 'gap-3 mt-2'
              }
            >
              {globalFilteredNodes.map((node) =>
                renderHolographicNodeCard(node, true)
              )}
            </View>
          )}
        </View>
      ) : (
        <>
          {/* 3A. SPATIAL SECTOR SELECTOR (7 PRECISION DOMAINS) */}
          <View style={styles.sectorSection}>
            <View style={styles.sectionHeaderInline}>
              <AppText
                variant="micro"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  color: colors.telemetryMono,
                  fontWeight: '800',
                  letterSpacing: 0.7,
                }}
              >
                01 // SELECT COGNITIVE SECTOR
              </AppText>
              <AppText variant="micro" tone="muted">
                7 Precision Domains
              </AppText>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectorCardsRow}
            >
              {DOMAIN_SECTORS.map((dm) => {
                const isSelected = selectedExamType === dm.id;
                return (
                  <Pressable
                    key={dm.id}
                    onPress={() => {
                      setExamType(dm.id);
                      const domainSubs =
                        dm.id === 'SCHOOL'
                          ? mockSubjectsByClass[10]
                          : mockSubjectsByExamType[dm.id];
                      if (domainSubs && domainSubs.length > 0) {
                        setActiveSubjectId(domainSubs[0].id);
                        setSubjectId(domainSubs[0].id);
                      }
                    }}
                    style={[
                      styles.sectorCard,
                      {
                        backgroundColor: isSelected
                          ? colors.primarySoft
                          : colors.surface,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        borderTopColor: isSelected
                          ? colors.primary
                          : colors.borderSpecular,
                      },
                    ]}
                  >
                    <View style={styles.sectorCardTop}>
                      <AppText
                        variant="micro"
                        style={{
                          fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                          color: isSelected
                            ? colors.primaryText
                            : colors.telemetryMono,
                          fontWeight: '800',
                        }}
                      >
                        {dm.code}
                      </AppText>
                      <AppText style={{ fontSize: 16 }}>{dm.icon}</AppText>
                    </View>
                    <AppText
                      variant="caption"
                      style={{
                        fontWeight: '800',
                        color: isSelected
                          ? colors.primaryText
                          : colors.textPrimary,
                        marginTop: 4,
                      }}
                    >
                      {dm.label}
                    </AppText>
                    <AppText
                      variant="micro"
                      style={{
                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                        fontSize: 9,
                        color: isSelected ? colors.primaryText : colors.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {dm.tag}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 3B. DISCIPLINE SUB-TRACK MATRIX */}
          <View style={styles.sectorSection}>
            <View style={styles.sectionHeaderInline}>
              <AppText
                variant="micro"
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  color: colors.telemetryMono,
                  fontWeight: '800',
                  letterSpacing: 0.7,
                }}
              >
                02 // DISCIPLINE SUB-TRACK
              </AppText>
              <AppText variant="micro" tone="muted">
                {availableSubjects.length} Active Tracks
              </AppText>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.disciplineRow}
            >
              {availableSubjects.map((subject, sIdx) => {
                const isSelected = activeSubjectId === subject.id;
                return (
                  <Pressable
                    key={subject.id}
                    onPress={() => {
                      setActiveSubjectId(subject.id);
                      setSubjectId(subject.id);
                    }}
                    style={[
                      styles.disciplinePill,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="micro"
                      style={{
                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                        color: isSelected
                          ? colors.textInverse
                          : colors.telemetryMono,
                        fontWeight: '800',
                      }}
                    >
                      TRK-0{sIdx + 1}
                    </AppText>
                    <AppText
                      variant="caption"
                      style={{
                        fontWeight: '800',
                        color: isSelected
                          ? colors.textInverse
                          : colors.textPrimary,
                      }}
                    >
                      {subject.name}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 3C. NUMBERED MODULE TRAJECTORY STRIP (MOD-01, MOD-02...) */}
          {chaptersLoading ? (
            <View className="py-8">
              <Loader />
            </View>
          ) : chapters && chapters.length > 0 ? (
            <View style={styles.sectorSection}>
              <View style={styles.sectionHeaderInline}>
                <AppText
                  variant="micro"
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    color: colors.telemetryMono,
                    fontWeight: '800',
                    letterSpacing: 0.7,
                  }}
                >
                  03 // MODULE TRAJECTORY ({chapters.length} MODULES)
                </AppText>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moduleRow}
              >
                {chapters.map((chap, cIdx) => {
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
                        styles.moduleCard,
                        {
                          backgroundColor: isSelected
                            ? colors.primarySoft
                            : colors.surface,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          borderTopColor: isSelected
                            ? colors.primary
                            : colors.borderSpecular,
                        },
                      ]}
                    >
                      <View style={styles.moduleCardHeader}>
                        <AppText
                          variant="micro"
                          style={{
                            fontFamily:
                              Platform.OS === 'ios' ? 'Courier' : 'monospace',
                            color: isSelected
                              ? colors.primaryText
                              : colors.telemetryMono,
                            fontWeight: '800',
                          }}
                        >
                          MOD-0{cIdx + 1}
                        </AppText>
                        <View
                          style={[
                            styles.moduleActiveDot,
                            {
                              backgroundColor: isSelected
                                ? colors.primary
                                : colors.border,
                            },
                          ]}
                        />
                      </View>
                      <AppText
                        variant="caption"
                        style={{
                          fontWeight: '800',
                          color: isSelected
                            ? colors.primaryText
                            : colors.textPrimary,
                          marginTop: 4,
                        }}
                      >
                        {title}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View className="mt-4">
              <EmptyState
                title="No modules found"
                description="Select another discipline track to inspect modules."
              />
            </View>
          )}

          {/* ===================================================================== */}
          {/* 4. 2040 CONSTELLATION OR HOLOGRAPHIC BENTO MATRIX GRID               */}
          {/* ===================================================================== */}
          <View className="mt-3 mb-8">
            <View style={styles.matrixHeaderBar}>
              <View style={{ flex: 1 }}>
                <AppText
                  variant="micro"
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    color: colors.telemetryMono,
                    fontWeight: '800',
                  }}
                >
                  04 // ACTIVE MODULE WORKSPACE
                </AppText>
                <AppText variant="h3" style={{ marginTop: 2 }}>
                  {activeChapter
                    ? typeof activeChapter.title === 'object'
                      ? (activeChapter.title[language] ?? activeChapter.title.en)
                      : activeChapter.title
                    : 'Cognitive Nodes'}
                </AppText>
                {topics && (
                  <AppText variant="caption" tone="muted">
                    {topics.length} synaptic nodes • Interactive topology & 45s reels ready
                  </AppText>
                )}
              </View>

              {/* 2040 Constellation vs Matrix Grid Switcher */}
              <View
                style={[
                  styles.layoutSwitcherBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Pressable
                  onPress={() => setExploreLayoutMode('constellation')}
                  style={[
                    styles.layoutTabBtn,
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
                      fontWeight: '800',
                      color:
                        exploreLayoutMode === 'constellation'
                          ? colors.textInverse
                          : colors.textSecondary,
                    }}
                  >
                    Constellation
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => setExploreLayoutMode('grid')}
                  style={[
                    styles.layoutTabBtn,
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
                      fontWeight: '800',
                      color:
                        exploreLayoutMode === 'grid'
                          ? colors.textInverse
                          : colors.textSecondary,
                    }}
                  >
                    Matrix Grid
                  </AppText>
                </Pressable>
              </View>
            </View>

            {topicsLoading ? (
              <View className="py-8">
                <Loader />
              </View>
            ) : !topics || topics.length === 0 ? (
              <EmptyState
                title="No topics in this module"
                description="Select another module above to view visual lessons."
              />
            ) : exploreLayoutMode === 'constellation' ? (
              <ConstellationGraph
                topics={topics}
                subjectName={activeSubject?.name ?? 'Domain Track'}
                chapterTitle={
                  activeChapter
                    ? typeof activeChapter.title === 'object'
                      ? (activeChapter.title[language] ?? activeChapter.title.en)
                      : activeChapter.title
                    : 'Core Module'
                }
              />
            ) : (
              <View
                className={
                  isDesktop ? 'flex-row flex-wrap gap-4' : 'gap-3'
                }
              >
                {enrichedModuleTopics.map((node) =>
                  renderHolographicNodeCard(node, false)
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
  commandDeckCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginTop: 10,
    marginBottom: 12,
  },
  commandDeckTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  commandTitleCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveBeaconDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  omnibarTriggerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  neuralSearchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  neuralTextInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  clearSearchBtn: {
    padding: 4,
  },
  lensStrip: {
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  lensPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
  },
  lensCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  studioShelfContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  studioShelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  studioShelfTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  studioLiveTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  collapseBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioCardsRow: {
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 2,
  },
  studioReelCard: {
    width: 245,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  studioCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioCardFooter: {
    marginTop: 8,
    paddingTop: 6,
  },
  sectorSection: {
    marginBottom: 12,
  },
  sectionHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sectorCardsRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  sectorCard: {
    minWidth: 122,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sectorCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disciplineRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  disciplinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  moduleRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  moduleCard: {
    minWidth: 165,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  moduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleActiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  matrixHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  layoutSwitcherBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    gap: 4,
  },
  layoutTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  resultsSection: {
    marginTop: 4,
    marginBottom: 28,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  resetFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  holoCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 15,
  },
  holoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  holoCoordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  holoPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  domainTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  holoBadgesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studioChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  diffChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  syncBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  syncTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  syncFill: {
    height: '100%',
    borderRadius: 999,
  },
  holoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  capPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  holoActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streamActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  nodeActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  quizIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
