import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { Icon } from '@/components/ui/Icon';
import { ErrorState } from '@/components/ui/ErrorState';

import { useTopicByIdQuery } from '@/services/api/hooks/useTopicByIdQuery';
import { useReelsByTopicQuery } from '@/services/api/hooks/useReelsByTopicQuery';
import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { useFlashcardsByTopicQuery } from '@/services/api/hooks/useFlashcardsByTopicQuery';
import { educationApi } from '@/services/api/educationApi';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

function formatDuration(seconds?: number): string {
  if (!seconds) return '1 min';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
}

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'reels' | 'flashcards'>('reels');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const watchedReels = useAppStore((s) => s.watchedReels);
  const viewMode = useAppStore((s) => s.viewMode);
  const { colors } = useTheme();
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';

  const { data: topic, isLoading: topicLoading, isError: topicError, refetch: refetchTopic } = useTopicByIdQuery(id || '');
  const { data: reels, isLoading: reelsLoading, refetch: refetchReels } = useReelsByTopicQuery(id || '');
  const { data: flashcards } = useFlashcardsByTopicQuery(id || '');
  const { data: bookmarks, refetch: refetchBookmarks } = useBookmarksQuery();

  useEffect(() => {
    if (bookmarks && id) {
      const isTopicBookmarked = bookmarks.some((bookmark) => bookmark.topicId === id);
      setIsBookmarked(isTopicBookmarked);
    }
  }, [bookmarks, id]);

  useEffect(() => {
    if (topic && id) {
      educationApi.trackAnalyticsEvent('topic_details_opened', {
        topicId: id,
        difficulty: topic.difficulty,
      });
    }
  }, [id, topic]);

  if (!id) {
    return (
      <ScreenContainer>
        <AppHeader title="Topic" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText tone="muted">Topic not specified</AppText>
        </View>
      </ScreenContainer>
    );
  }

  if (topicLoading || reelsLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Topic Revision" onBack={() => router.back()} />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (topicError || !topic) {
    return (
      <ScreenContainer>
        <AppHeader title="Topic Revision" onBack={() => router.back()} />
        <View className="mt-8">
          <ErrorState
            title="Failed to load topic details"
            description="Could not fetch lessons. Please try again."
            actionLabel="Retry"
            onPressAction={() => {
              refetchTopic();
              refetchReels();
            }}
          />
        </View>
      </ScreenContainer>
    );
  }

  // Count watched reels for checkpoints
  const totalReelsCount = reels?.length ?? 0;
  const watchedCount = reels?.filter((r) => watchedReels[r.id]).length ?? 0;
  const progressPercent = totalReelsCount > 0 ? Math.round((watchedCount / totalReelsCount) * 100) : 0;

  return (
    <ScreenContainer scroll>
      <AppHeader title="Topic Revision" onBack={() => router.back()} />

      <View className="mt-3">
        {/* Main Topic Header Card */}
        <AppCard tone="primarySoft" className="mb-4 border-indigo-100">
          <AppText variant="caption" tone="primary" className="font-semibold">
            {topic.subject?.name ?? 'Subject'} • {topic.chapter?.title ?? 'Chapter'}
          </AppText>
          <AppText variant="h2" className="text-slate-900 mt-1">
            {topic.title}
          </AppText>

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
                <AppText variant="micro" tone="inverse" style={{ textTransform: 'capitalize', fontWeight: '700' }}>
                  {topic.difficulty}
                </AppText>
              </View>
              <View style={{ backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
                <AppText variant="micro" tone="secondary">
                  {topic.reelCount} Visual Reels
                </AppText>
              </View>
            </View>

            <Pressable
              onPress={async () => {
                try {
                  if (isBookmarked) {
                    const existing = bookmarks?.find((b) => b.topicId === id);
                    if (existing) await educationApi.deleteBookmark(existing.id);
                    setIsBookmarked(false);
                  } else {
                    await educationApi.createBookmark(id);
                    setIsBookmarked(true);
                  }
                  refetchBookmarks();
                } catch (err) {
                  console.error('Bookmark error:', err);
                }
              }}
              style={{
                padding: 8,
                borderRadius: 999,
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primaryText : colors.textMuted}
              />
            </Pressable>
          </View>
        </AppCard>

        {/* 📍 Checkpoint Progress Track */}
        <AppCard tone="default" className="mb-5 border-slate-200 bg-slate-50 p-3.5">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Icon name="stats-chart" size={16} color="#4F46E5" />
              <AppText variant="caption" className="font-bold text-slate-800">
                Reels Progress Checkpoints
              </AppText>
            </View>
            <AppText variant="caption" tone="primary" className="font-bold">
              {watchedCount}/{totalReelsCount} watched
            </AppText>
          </View>

          {/* Horizontal Track Bar with Dots */}
          <View className="flex-row items-center justify-between my-2">
            {reels?.map((r, i) => {
              const isWatched = watchedReels[r.id];
              return (
                <React.Fragment key={r.id}>
                  <View
                    className={`h-4 w-4 rounded-full items-center justify-center ${
                      isWatched ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    {isWatched && <Icon name="checkmark" size={10} color="#FFFFFF" />}
                  </View>
                  {i < totalReelsCount - 1 && (
                    <View
                      className={`flex-1 h-1 mx-1 rounded-full ${
                        isWatched ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          <AppText variant="micro" tone="muted" className="mt-1">
            {progressPercent === 100
              ? '🎉 All reels in this topic completed! Take the quiz below.'
              : `${totalReelsCount - watchedCount} more reels to finish this topic.`}
          </AppText>
        </AppCard>

        {/* Tab Switcher: Reels vs Flashcards */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200">
          <Pressable
            onPress={() => setActiveTab('reels')}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              activeTab === 'reels' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <AppText
              variant="caption"
              tone={activeTab === 'reels' ? 'primary' : 'muted'}
              className="font-bold"
            >
              🎬 Visual Reels ({reels?.length ?? 0})
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('flashcards')}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              activeTab === 'flashcards' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <AppText
              variant="caption"
              tone={activeTab === 'flashcards' ? 'primary' : 'muted'}
              className="font-bold"
            >
              ⚡ Flashcard Flip
            </AppText>
          </Pressable>
        </View>

        {activeTab === 'reels' ? (
          /* Video Lessons List */
          <View className="mb-6">
            {reels && reels.length > 0 ? (
              <View className={isDesktop ? "flex-row flex-wrap gap-4" : "gap-3"}>
                {reels.map((item, index) => {
                  const isWatched = watchedReels[item.id];
                  return (
                    <Pressable
                      key={item.id}
                      style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                      onPress={() => {
                        educationApi.trackAnalyticsEvent('reel_started', {
                          reelId: item.id,
                          reelNumber: index + 1,
                        });
                        router.push(`/reel/${item.id}?topicId=${id}`);
                      }}
                    >
                      <AppCard tone="default" className="border-slate-200">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-3 flex-1 mr-3">
                            <View
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 21,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isWatched ? colors.successSoft : colors.primarySoft,
                                borderColor: isWatched ? colors.success : colors.primaryBorder,
                                borderWidth: 1,
                              }}
                            >
                              <Icon
                                name={isWatched ? 'checkmark-circle' : 'play'}
                                size={18}
                                color={isWatched ? colors.success : colors.primaryText}
                              />
                            </View>
                            <View className="flex-1">
                              <AppText variant="bodyMedium" className="font-semibold text-slate-900">
                                {item.title}
                              </AppText>
                              <View className="flex-row items-center gap-2 mt-1">
                                <AppText variant="micro" tone="muted">
                                  Reel {index + 1} • {formatDuration(item.durationSec)}
                                </AppText>
                                {isWatched && (
                                  <View className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                    <AppText variant="micro" className="text-emerald-700 font-bold">
                                      Watched
                                    </AppText>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                          <Icon name="chevron-forward" size={18} color="#94A3B8" />
                        </View>
                      </AppCard>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <AppCard tone="muted">
                <AppText variant="body" tone="secondary" className="text-center py-4">
                  No video reels currently loaded for this topic.
                </AppText>
              </AppCard>
            )}
          </View>
        ) : (
          /* ⚡ Flashcard Flip Component with Multi-Card Deck Pager */
          <View className="mb-6">
            {(() => {
              const cards =
                flashcards && flashcards.length > 0
                  ? flashcards
                  : [
                      {
                        id: `fc-${id}-default`,
                        topicId: id,
                        frontQuestion: `What are the core principles and high-yield insights of ${topic.title}?`,
                        backAnswer:
                          topic.cheatSheetSummary?.[0] ??
                          `Understand foundational axioms, proof strategies, and practical applications of ${topic.title}.`,
                        bullets: topic.cheatSheetSummary?.slice(1) ?? [],
                      },
                    ];

              const safeIndex = Math.min(cardIndex, cards.length - 1);
              const fc = cards[safeIndex];

              return (
                <View>
                  <Pressable onPress={() => setIsCardFlipped((prev) => !prev)}>
                    <AppCard
                      tone="default"
                      style={{
                        minHeight: 220,
                        justifyContent: 'space-between',
                        padding: 20,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: isCardFlipped ? colors.primary : colors.border,
                        backgroundColor: isCardFlipped ? colors.primarySoft : colors.surface,
                      }}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View style={{ backgroundColor: colors.surfaceSubtle, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                          <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
                            {isCardFlipped ? '💡 ANSWER & ARCHITECTURE' : '❓ ACTIVE RECALL PROMPT'}
                          </AppText>
                        </View>
                        <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                          Tap to Flip ↻
                        </AppText>
                      </View>

                      <View className="my-auto py-2">
                        <AppText variant="h3" style={{ lineHeight: 24 }}>
                          {isCardFlipped ? fc.backAnswer : fc.frontQuestion}
                        </AppText>

                        {isCardFlipped && fc.bullets && fc.bullets.length > 0 && (
                          <View className="mt-4 gap-1.5">
                            {fc.bullets.map((b, bIdx) => (
                              <AppText key={bIdx} variant="caption" tone="secondary">
                                • {b}
                              </AppText>
                            ))}
                          </View>
                        )}
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.borderSubtle }}>
                        <AppText variant="micro" tone="muted">
                          Self-test your memory before the reel
                        </AppText>
                        <Icon name="swap-horizontal" size={18} color={colors.primaryText} />
                      </View>
                    </AppCard>
                  </Pressable>

                  {/* Deck Paging Controls */}
                  {cards.length > 1 && (
                    <View className="flex-row items-center justify-between mt-3 px-1">
                      <Pressable
                        disabled={safeIndex === 0}
                        onPress={() => {
                          setIsCardFlipped(false);
                          setCardIndex((prev) => Math.max(0, prev - 1));
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: safeIndex === 0 ? colors.borderSubtle : colors.primaryBorder,
                          backgroundColor: safeIndex === 0 ? colors.surfaceSubtle : colors.primarySoft,
                          opacity: safeIndex === 0 ? 0.4 : 1,
                        }}
                      >
                        <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                          ← Previous
                        </AppText>
                      </Pressable>

                      <AppText variant="micro" tone="secondary" style={{ fontWeight: '600' }}>
                        Card {safeIndex + 1} of {cards.length}
                      </AppText>

                      <Pressable
                        disabled={safeIndex === cards.length - 1}
                        onPress={() => {
                          setIsCardFlipped(false);
                          setCardIndex((prev) => Math.min(cards.length - 1, prev + 1));
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: safeIndex === cards.length - 1 ? colors.borderSubtle : colors.primaryBorder,
                          backgroundColor: safeIndex === cards.length - 1 ? colors.surfaceSubtle : colors.primarySoft,
                          opacity: safeIndex === cards.length - 1 ? 0.4 : 1,
                        }}
                      >
                        <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                          Next Card →
                        </AppText>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })()}
          </View>
        )}

        {/* Action Buttons: Quiz Checkpoint */}
        <View className="mb-10 gap-3">
          <AppButton
            label="Take Practice Quiz Checkpoint"
            variant="primary"
            leftIcon={<Icon name="help-circle-outline" size={20} color="#FFFFFF" />}
            onPress={() => {
              educationApi.trackAnalyticsEvent('quiz_started', { topicId: id });
              router.push(`/quiz/${id}`);
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
