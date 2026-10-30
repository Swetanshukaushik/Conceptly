import React, { useEffect, useState, useMemo } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { CognitiveTelemetryBar } from '@/components/ui/CognitiveTelemetryBar';
import { BionicText } from '@/components/ui/BionicText';

import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { educationApi } from '@/services/api/educationApi';
import { mockFlashcards, TOPICS_WITH_REAL_REELS } from '@/services/api/mockData';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function BookmarksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: bookmarks, isLoading, refetch } = useBookmarksQuery();
  const viewMode = useAppStore((s) => s.viewMode);
  const flashcardSRS = useAppStore((s) => s.flashcardSRS);
  const rateFlashcard = useAppStore((s) => s.rateFlashcard);
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'srs'>('bookmarks');
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    educationApi.trackAnalyticsEvent('bookmarks_viewed');
  }, []);

  // Build unified SM-2 Review Queue across all bookmarked topics & global flashcards
  const reviewDeck = useMemo(() => {
    const rawCards = Object.values(mockFlashcards).flat();
    const allCards = onlyTopicsWithReels
      ? rawCards.filter((c) => TOPICS_WITH_REAL_REELS.has(c.topicId))
      : rawCards;
    const now = Date.now();

    return [...allCards].sort((a, b) => {
      const srsA = flashcardSRS[a.id];
      const srsB = flashcardSRS[b.id];
      const dueA = !srsA ? 0 : srsA.nextReviewAt <= now ? 1 : 2;
      const dueB = !srsB ? 0 : srsB.nextReviewAt <= now ? 1 : 2;
      if (dueA !== dueB) return dueA - dueB;
      return (srsA?.box ?? 1) - (srsB?.box ?? 1);
    });
  }, [flashcardSRS, onlyTopicsWithReels]);

  const dueCount = useMemo(() => {
    const now = Date.now();
    return reviewDeck.filter((c) => {
      const srs = flashcardSRS[c.id];
      return !srs || srs.nextReviewAt <= now || srs.box <= 2;
    }).length;
  }, [reviewDeck, flashcardSRS]);

  const masteredCount = useMemo(() => {
    return reviewDeck.filter((c) => (flashcardSRS[c.id]?.box ?? 0) >= 4).length;
  }, [reviewDeck, flashcardSRS]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Saved & Synaptic Vault" subtitle="Bookmarks & Spaced Repetition" />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  const safeCardIdx = Math.min(cardIndex, Math.max(0, reviewDeck.length - 1));
  const currentCard = reviewDeck[safeCardIdx];
  const currentSRS = currentCard ? flashcardSRS[currentCard.id] : undefined;

  return (
    <ScreenContainer scroll>
      <AppHeader
        title="Saved & Synaptic Vault"
        subtitle={`${bookmarks?.length ?? 0} saved topics • ${dueCount} flashcards due`}
      />

      <CognitiveTelemetryBar />

      {/* Dual Mode Switcher: Saved Topics vs SM-2 Spaced Repetition Deck */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.surfaceSubtle,
          padding: 4,
          borderRadius: 14,
          marginTop: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => setActiveTab('bookmarks')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: activeTab === 'bookmarks' ? colors.surface : 'transparent',
            borderWidth: 1,
            borderColor: activeTab === 'bookmarks' ? colors.borderActive : 'transparent',
          }}
        >
          <AppText
            variant="caption"
            tone={activeTab === 'bookmarks' ? 'primary' : 'muted'}
            style={{ fontWeight: '700' }}
          >
            🔖 Saved Lessons ({bookmarks?.length ?? 0})
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('srs')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: activeTab === 'srs' ? colors.surface : 'transparent',
            borderWidth: 1,
            borderColor: activeTab === 'srs' ? colors.borderActive : 'transparent',
          }}
        >
          <AppText
            variant="caption"
            tone={activeTab === 'srs' ? 'primary' : 'muted'}
            style={{ fontWeight: '700' }}
          >
            🧠 Synaptic Review Queue ({dueCount} Due)
          </AppText>
        </Pressable>
      </View>

      {activeTab === 'bookmarks' ? (
        !bookmarks || bookmarks.length === 0 ? (
          <View className="mt-8">
            <EmptyState
              title="No bookmarks yet"
              description="Save topics or lessons while learning to easily review them here anytime."
            />
          </View>
        ) : (
          <View className={isDesktop ? 'mt-2 mb-8 flex-row flex-wrap gap-4' : 'mt-2 mb-8 gap-3'}>
            {bookmarks.map((item) => (
              <Pressable
                key={item.id}
                style={isDesktop ? ({ width: 'calc(50% - 8px)' } as any) : undefined}
                onPress={() => {
                  router.push(`/topic/${item.topicId}`);
                }}
              >
                <AppCard tone="default">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-2">
                      <AppText variant="caption" tone="primary" numberOfLines={1}>
                        {item.subject?.name ?? 'Subject'} • {item.chapter?.title ?? 'Chapter'}
                      </AppText>
                      <AppText variant="title" style={{ marginTop: 4, fontWeight: '700' }}>
                        {item.topic?.title ?? 'Topic'}
                      </AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.warningSoft,
                        borderColor: colors.warning,
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 999,
                      }}
                    >
                      <Icon name="bookmark" size={16} color={colors.warningText} />
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTopWidth: 1,
                      borderTopColor: colors.borderSubtle,
                      paddingTop: 12,
                    }}
                  >
                    <View className="flex-row gap-2">
                      <AppButton
                        label="Resume Lesson"
                        size="sm"
                        variant="primary"
                        onPress={() => {
                          router.push(`/topic/${item.topicId}`);
                        }}
                      />
                      <AppButton
                        label="Remove"
                        variant="ghost"
                        size="sm"
                        onPress={async () => {
                          await educationApi.deleteBookmark(item.id);
                          refetch();
                        }}
                      />
                    </View>

                    {item.reelId && (
                      <Pressable
                        onPress={() => {
                          router.push(`/reel/${item.reelId}?topicId=${item.topicId}`);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          backgroundColor: colors.primarySoft,
                          borderColor: colors.primaryBorder,
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 999,
                        }}
                      >
                        <Icon name="play" size={12} color={colors.primaryText} />
                        <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                          Watch Reel
                        </AppText>
                      </Pressable>
                    )}
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </View>
        )
      ) : (
        /* 🧠 Dedicated SM-2 Spaced Repetition Queue */
        <View className="mb-10">
          {/* Leitner Vault Telemetry Summary */}
          <AppCard tone="muted" style={{ marginBottom: 16, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <AppText variant="micro" tone="primary" style={{ fontWeight: '800', letterSpacing: 0.6 }}>
                  LEITNER SPACED-REPETITION MATRIX (SM-2)
                </AppText>
                <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  Cards graded &quot;Again&quot; or &quot;Hard&quot; automatically surface to the front of your queue.
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: colors.accentTealSoft,
                  borderColor: colors.accentTeal,
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                }}
              >
                <AppText variant="micro" style={{ color: colors.accentTealText, fontWeight: '800' }}>
                  {masteredCount}/{reviewDeck.length} MASTERED
                </AppText>
              </View>
            </View>
          </AppCard>

          {currentCard && (
            <View>
              <Pressable onPress={() => setIsCardFlipped((prev) => !prev)}>
                <AppCard
                  tone="default"
                  style={{
                    minHeight: 230,
                    justifyContent: 'space-between',
                    padding: 20,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: isCardFlipped ? colors.primary : colors.borderSpecular,
                    backgroundColor: isCardFlipped ? colors.primarySoft : colors.surface,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <View
                        style={{
                          backgroundColor: colors.surfaceSubtle,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 999,
                        }}
                      >
                        <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
                          {isCardFlipped ? '💡 SYNAPTIC SOLUTION' : '❓ ACTIVE RECALL PROMPT'}
                        </AppText>
                      </View>
                      <View
                        style={{
                          backgroundColor: currentSRS ? colors.accentTealSoft : colors.warningSoft,
                          borderColor: currentSRS ? colors.accentTeal : colors.warning,
                          borderWidth: 1,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 999,
                        }}
                      >
                        <AppText
                          variant="micro"
                          style={{
                            color: currentSRS ? colors.accentTealText : colors.warningText,
                            fontWeight: '800',
                          }}
                        >
                          {currentSRS ? `LEITNER BOX ${currentSRS.box}/5` : 'DUE NOW • NEW'}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                      Tap to Flip ↻
                    </AppText>
                  </View>

                  <View className="my-auto py-3">
                    {isCardFlipped ? (
                      <BionicText
                        text={currentCard.backAnswer}
                        style={{ fontSize: 18, lineHeight: 26, color: colors.textPrimary }}
                      />
                    ) : (
                      <BionicText
                        text={currentCard.frontQuestion}
                        style={{ fontSize: 18, lineHeight: 26, color: colors.textPrimary }}
                      />
                    )}

                    {isCardFlipped && currentCard.bullets && currentCard.bullets.length > 0 && (
                      <View className="mt-4 gap-1.5">
                        {currentCard.bullets.map((b, bIdx) => (
                          <BionicText
                            key={bIdx}
                            text={`• ${b}`}
                            style={{ fontSize: 13, lineHeight: 19 }}
                          />
                        ))}
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 14,
                      borderTopWidth: 1,
                      borderTopColor: colors.borderSubtle,
                    }}
                  >
                    <Pressable
                      onPress={() => router.push(`/topic/${currentCard.topicId}`)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Icon name="open-outline" size={14} color={colors.primaryText} />
                      <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                        Open Source Topic ({currentCard.topicId.replace('topic-', '')})
                      </AppText>
                    </Pressable>
                    <AppText variant="micro" tone="muted">
                      Card {safeCardIdx + 1} of {reviewDeck.length}
                    </AppText>
                  </View>
                </AppCard>
              </Pressable>

              {/* SM-2 Grading Matrix */}
              <View
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: colors.surfaceSubtle,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <AppText variant="micro" tone="secondary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    RATE RECALL TO SCHEDULE NEXT REVIEW
                  </AppText>
                  <AppText variant="micro" style={{ color: colors.telemetryMono, fontWeight: '700' }}>
                    {currentSRS ? `LAST: ${currentSRS.lastGrade.toUpperCase()}` : 'UNGRADED'}
                  </AppText>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    {
                      grade: 'again' as const,
                      label: 'Again',
                      sub: '10m',
                      bg: colors.dangerSoft,
                      border: colors.danger,
                      text: colors.dangerText,
                    },
                    {
                      grade: 'hard' as const,
                      label: 'Hard',
                      sub: '1d',
                      bg: colors.warningSoft,
                      border: colors.warning,
                      text: colors.warningText,
                    },
                    {
                      grade: 'good' as const,
                      label: 'Good',
                      sub: '3d',
                      bg: colors.primarySoft,
                      border: colors.primary,
                      text: colors.primaryText,
                    },
                    {
                      grade: 'easy' as const,
                      label: 'Easy',
                      sub: '7d',
                      bg: colors.successSoft,
                      border: colors.success,
                      text: colors.successText,
                    },
                  ].map((btn) => (
                    <Pressable
                      key={btn.grade}
                      onPress={() => {
                        rateFlashcard(currentCard.id, btn.grade);
                        setIsCardFlipped(false);
                        setCardIndex((prev) => (prev + 1) % reviewDeck.length);
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        backgroundColor: btn.bg,
                        borderColor: btn.border,
                        alignItems: 'center',
                      }}
                    >
                      <AppText variant="caption" style={{ color: btn.text, fontWeight: '800' }}>
                        {btn.label}
                      </AppText>
                      <AppText variant="micro" style={{ color: btn.text, opacity: 0.85 }}>
                        {btn.sub}
                      </AppText>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Deck Navigation */}
              <View className="flex-row items-center justify-between mt-3 px-1">
                <Pressable
                  onPress={() => {
                    setIsCardFlipped(false);
                    setCardIndex((prev) => (prev - 1 + reviewDeck.length) % reviewDeck.length);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.primaryBorder,
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                    ← Previous Card
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsCardFlipped(false);
                    setCardIndex((prev) => (prev + 1) % reviewDeck.length);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.primaryBorder,
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                    Next Card →
                  </AppText>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}
