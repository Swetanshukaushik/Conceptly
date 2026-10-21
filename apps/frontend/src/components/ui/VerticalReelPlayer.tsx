import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { Icon } from './Icon';
import { ViewportToggle } from './ViewportToggle';
import { educationApi } from '@/services/api/educationApi';
import { useAppStore } from '@/store/useAppStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/queryKeys';
import type { ReelDto } from '@/services/api/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPEED_OPTIONS = [1.0, 1.25, 1.5, 2.0];

export type VerticalReelPlayerProps = {
  reels: ReelDto[];
  initialReelId?: string;
  onQuizPress?: (topicId: string) => void;
  onFlashcardPress?: (topicId: string) => void;
  onBack?: () => void;
};

function formatSeconds(secs?: number): string {
  if (!secs) return '0:45';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 📑 Reusable Rapid Revision Cheat Sheet Modal
function ReelCheatSheetModal({
  visible,
  onClose,
  reel,
  onQuizPress,
}: {
  visible: boolean;
  onClose: () => void;
  reel: ReelDto;
  onQuizPress?: (topicId: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>⚡ Rapid Revision Cheat-Sheet</Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {reel.title}
                </Text>
              </View>
              <Pressable onPress={onClose} style={styles.modalCloseButton}>
                <Icon name="close" size={20} color="#94A3B8" />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            {/* Key Takeaway Banner */}
            <View style={styles.modalTakeawayBanner}>
              <Text style={styles.modalTakeawayHeader}>🎯 CORE INTERVIEW TAKEAWAY</Text>
              <Text style={styles.modalTakeawayBody}>
                {reel.keyTakeaway ?? 'Master this mental model to confidently explain trade-offs during interviews.'}
              </Text>
            </View>

            {/* 🎤 30-Second Verbatim Pitch */}
            {reel.interviewPitch && (
              <View style={styles.modalPitchBanner}>
                <View style={styles.pitchHeaderRow}>
                  <Icon name="mic" size={15} color="#38BDF8" />
                  <Text style={styles.pitchHeaderText}>30-SECOND INTERVIEW PITCH</Text>
                </View>
                <Text style={styles.pitchSubheader}>Say this directly when asked by the interviewer:</Text>
                <Text style={styles.pitchBody}>"{reel.interviewPitch}"</Text>
              </View>
            )}

            {/* 📐 Visual Architecture Flow Diagram */}
            {reel.architectureDiagram && (
              <View style={styles.modalDiagramContainer}>
                <View style={styles.diagramHeaderRow}>
                  <Icon name="git-network" size={15} color="#A78BFA" />
                  <Text style={styles.diagramHeaderText}>VISUAL ARCHITECTURE FLOW</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagramScroll}>
                  <Text style={styles.diagramMonospace}>
                    {reel.architectureDiagram.trim()}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* ⚠️ Interview Red Flags & Mistakes to Avoid */}
            {reel.pitfalls && reel.pitfalls.length > 0 && (
              <View style={styles.modalPitfallsContainer}>
                <View style={styles.pitfallsHeaderRow}>
                  <Icon name="alert-circle" size={15} color="#F87171" />
                  <Text style={styles.pitfallsHeaderText}>INTERVIEW RED FLAGS (AVOID SAYING)</Text>
                </View>
                <View style={styles.pitfallsList}>
                  {reel.pitfalls.map((pitfall, pIdx) => (
                    <View key={pIdx} style={styles.pitfallRow}>
                      <Text style={styles.pitfallCross}>✗</Text>
                      <Text style={styles.pitfallText}>{pitfall}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bullet Points */}
            <Text style={styles.bulletSectionTitle}>Key Concepts & Notes</Text>
            <View style={styles.bulletsContainer}>
              {(reel.summaryNotes && reel.summaryNotes.length > 0
                ? reel.summaryNotes
                : [
                    'High-frequency interview question tested across top companies.',
                    'Always state your assumptions before diving into architecture or code.',
                    'Clearly explain scalability, failure modes, and trade-offs.',
                  ]
              ).map((note, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{note}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons in Modal */}
            <View style={styles.modalActions}>
              {onQuizPress && (
                <Pressable
                  onPress={() => {
                    onClose();
                    onQuizPress(reel.topicId);
                  }}
                  style={styles.modalQuizButton}
                >
                  <Text style={styles.modalQuizButtonText}>Take Topic Quiz Checkpoint →</Text>
                </Pressable>
              )}
              <Pressable onPress={onClose} style={styles.modalDismissButton}>
                <Text style={styles.modalDismissText}>Back to Video</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// 📱 Dedicated Mobile Vertical Reel Player (Centered 500px Frame with Full Overlay Controls)
function MobileVerticalReelPlayer({
  reels,
  initialIndex,
  onQuizPress,
  onFlashcardPress,
  onBack,
}: {
  reels: ReelDto[];
  initialIndex: number;
  onQuizPress?: (topicId: string) => void;
  onFlashcardPress?: (topicId: string) => void;
  onBack?: () => void;
}) {
  const isWeb = Platform.OS === 'web';
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, reels]);

  const reel = reels[activeIndex] || reels[0];
  const totalCount = reels.length;

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(isWeb);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);

  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed);
  const watchedReels = useAppStore((s) => s.watchedReels);
  const markReelWatched = useAppStore((s) => s.markReelWatched);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsPlaying(true);
    videoRef.current?.playAsync().catch(() => {});
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    if (reel?.id) {
      markReelWatched(reel.id);
    }
  }, [reel?.id, playbackSpeed, markReelWatched]);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync().catch(() => {});
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const cycleSpeed = async () => {
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextSpeed = SPEED_OPTIONS[(currentIndex + 1) % SPEED_OPTIONS.length];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(nextSpeed, true).catch(() => {});
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const res = await educationApi.toggleBookmark(reel.topicId, reel.id);
      setIsSaved(res.bookmarked);
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks() });
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsBuffering(true);
      return;
    }
    setIsBuffering(status.isBuffering);

    if (status.didJustFinish) {
      educationApi.recordReelView(reel.id, {
        reelId: reel.id,
        watchDurationSec: Math.round(((status as any).durationMillis ?? 45000) / 1000),
        completed: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });
    }
  };

  const remainingCount = Math.max(0, totalCount - (activeIndex + 1));

  // Touch Swipe Gesture handler (Swipe Up -> Next, Swipe Down -> Prev)
  const touchStartY = useRef<number>(0);
  const onTouchStart = (e: any) => {
    touchStartY.current = e.nativeEvent?.pageY || e.nativeEvent?.clientY || 0;
  };
  const onTouchEnd = (e: any) => {
    const currentY = e.nativeEvent?.pageY || e.nativeEvent?.clientY || 0;
    const diff = touchStartY.current - currentY;
    if (diff > 45 && activeIndex < totalCount - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (diff < -45 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Keyboard navigation on Web (ArrowDown / ArrowUp)
  useEffect(() => {
    if (isWeb && typeof window !== 'undefined') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          setActiveIndex((prev) => Math.min(totalCount - 1, prev + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          setActiveIndex((prev) => Math.max(0, prev - 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [totalCount, isWeb]);

  return (
    <View style={styles.mobileOuterContainer}>
      <View
        style={styles.mobilePlayerFrame}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Full Video Area (Tap to play/pause) */}
        <Pressable onPress={togglePlayPause} style={styles.mobileVideoPressable}>
          <Video
            ref={videoRef}
            source={{ uri: reel.videoUrl }}
            style={styles.mobileVideo}
            resizeMode={ResizeMode.COVER}
            isLooping={true}
            isMuted={isMuted}
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            useNativeControls={false}
          />

          {/* Buffering Indicator */}
          {isBuffering && (
            <View style={styles.bufferingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}

          {/* Pause Overlay Icon */}
          {!isPlaying && !isBuffering && (
            <View style={styles.pauseOverlay}>
              <View style={styles.pauseIconBadge}>
                <Icon name="play" size={36} color="#FFFFFF" />
              </View>
            </View>
          )}
        </Pressable>

        {/* 🔝 Top Header Overlay */}
        <View style={styles.mobileTopHeader} pointerEvents="box-none">
          {onBack && (
            <Pressable onPress={onBack} style={styles.mobileBackButton}>
              <Icon name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.mobileBackText}>Back</Text>
            </Pressable>
          )}

          <View style={styles.mobileTopicBadge}>
            <Text style={styles.mobileTopicBadgeText} numberOfLines={1}>
              {reel.topic?.title ?? 'Revision Reel'}
            </Text>
          </View>

          {isWeb && <ViewportToggle inline />}
        </View>

        {/* 📍 Checkpoint Track Layer */}
        <View style={styles.mobileTrackContainer}>
          <View style={styles.checkpointTrackRow}>
            {Array.from({ length: totalCount }).map((_, i) => {
              const targetReelId = reels[i]?.id;
              const isPastOrWatched = i < activeIndex || (targetReelId && watchedReels[targetReelId]);
              const isCurrent = i === activeIndex;

              return (
                <React.Fragment key={i}>
                  <Pressable
                    onPress={() => setActiveIndex(i)}
                    style={[
                      styles.checkpointDot,
                      isCurrent && styles.checkpointDotCurrent,
                      isPastOrWatched && !isCurrent && styles.checkpointDotCompleted,
                    ]}
                  >
                    {isPastOrWatched && !isCurrent && (
                      <Icon name="checkmark" size={10} color="#FFFFFF" />
                    )}
                    {isCurrent && <View style={styles.currentDotPulse} />}
                  </Pressable>

                  {i < totalCount - 1 && (
                    <View
                      style={[
                        styles.trackSegment,
                        i < activeIndex && styles.trackSegmentActive,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          <View style={styles.trackSummaryRow}>
            <Text style={styles.trackSummaryText}>
              Checkpoint {activeIndex + 1} of {totalCount}
            </Text>
            <Text style={styles.trackRemainingText}>
              {remainingCount === 0 ? '🎉 All reels watched!' : `${remainingCount} remaining`}
            </Text>
          </View>
        </View>

        {/* 👉 Right Side Action Controls */}
        <View style={styles.mobileRightActions}>
          {/* Speed switcher (1x, 1.25x, 1.5x, 2x) */}
          <Pressable onPress={cycleSpeed} style={styles.actionCircleButton}>
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
            <Text style={styles.actionLabel}>Speed</Text>
          </Pressable>

          {/* Cheat-Sheet / Notes Drawer Button */}
          <Pressable onPress={() => setShowNotesDrawer(true)} style={styles.actionCircleButton}>
            <Icon name="document-text" size={20} color="#FFFFFF" />
            <Text style={styles.actionLabel}>Notes</Text>
          </Pressable>

          {/* Mute toggle */}
          <Pressable onPress={toggleMute} style={styles.actionCircleButton}>
            <Icon
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Audio'}</Text>
          </Pressable>

          {/* Bookmark Button */}
          <Pressable onPress={handleBookmarkToggle} style={styles.actionCircleButton}>
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isSaved ? '#FBBF24' : '#FFFFFF'}
            />
            <Text style={styles.actionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
          </Pressable>

          {/* Practice Quiz Button */}
          {onQuizPress && (
            <Pressable
              onPress={() => onQuizPress(reel.topicId)}
              style={[styles.actionCircleButton, styles.quizCircleButton]}
            >
              <Icon name="help-circle" size={22} color="#FFFFFF" />
              <Text style={styles.actionLabel}>Quiz</Text>
            </Pressable>
          )}
        </View>

        {/* 🔻 Bottom Details & Key Takeaway Overlay */}
        <View style={styles.mobileBottomOverlay} pointerEvents="box-none">
          <View style={styles.chapterBadgeRow}>
            <View style={styles.subjectTag}>
              <Text style={styles.subjectTagText}>
                {reel.subject?.name ?? 'Topic'}
              </Text>
            </View>
            <Text style={styles.chapterSubtitleText} numberOfLines={1}>
              {reel.chapter?.title ?? 'Module'}
            </Text>
          </View>

          <Text style={styles.reelTitleText}>{reel.title}</Text>

          {/* Key takeaway quick pill */}
          {reel.keyTakeaway && (
            <View style={styles.takeawayPill}>
              <Icon name="bulb" size={14} color="#FBBF24" />
              <Text style={styles.takeawayText} numberOfLines={2}>
                {reel.keyTakeaway}
              </Text>
            </View>
          )}

          <View style={styles.bottomMetaRow}>
            <View style={styles.durationPill}>
              <Icon name="time-outline" size={13} color="#CBD5E1" />
              <Text style={styles.durationText}>{formatSeconds(reel.durationSec)}</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              {/* Cheat Sheet Quick View */}
              <Pressable
                onPress={() => setShowNotesDrawer(true)}
                style={styles.sheetTriggerButton}
              >
                <Icon name="reader-outline" size={14} color="#FFFFFF" />
                <Text style={styles.sheetTriggerText}>Cheat Sheet</Text>
              </Pressable>

              {/* Quiz Banner */}
              {onQuizPress && (
                <Pressable
                  onPress={() => onQuizPress(reel.topicId)}
                  style={styles.quizBannerButton}
                >
                  <Icon name="school-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.quizBannerText}>Take Quiz</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* 🔄 Bottom Reel Pager (Prev / Next) */}
        <View style={styles.mobilePagerBar}>
          <Pressable
            onPress={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            style={[
              styles.mobilePagerBtn,
              activeIndex === 0 && styles.mobilePagerBtnDisabled,
            ]}
          >
            <Icon
              name="chevron-back"
              size={15}
              color={activeIndex === 0 ? '#475569' : '#FFFFFF'}
            />
            <Text
              style={[
                styles.mobilePagerBtnText,
                activeIndex === 0 && styles.mobilePagerBtnTextDisabled,
              ]}
            >
              Prev
            </Text>
          </Pressable>

          <Text style={styles.mobilePagerCountText}>
            Reel {activeIndex + 1} of {totalCount}
          </Text>

          <Pressable
            onPress={() => setActiveIndex(Math.min(totalCount - 1, activeIndex + 1))}
            disabled={activeIndex === totalCount - 1}
            style={[
              styles.mobilePagerBtn,
              activeIndex === totalCount - 1 && styles.mobilePagerBtnDisabled,
            ]}
          >
            <Text
              style={[
                styles.mobilePagerBtnText,
                activeIndex === totalCount - 1 && styles.mobilePagerBtnTextDisabled,
              ]}
            >
              Next
            </Text>
            <Icon
              name="chevron-forward"
              size={15}
              color={activeIndex === totalCount - 1 ? '#475569' : '#FFFFFF'}
            />
          </Pressable>
        </View>

        {/* 📑 Instant Cheat Sheet Drawer Modal */}
        <ReelCheatSheetModal
          visible={showNotesDrawer}
          onClose={() => setShowNotesDrawer(false)}
          reel={reel}
          onQuizPress={onQuizPress}
        />
      </View>
    </View>
  );
}

// 💻 Dedicated Desktop Studio Player (2-Column Studio View)
function DesktopStudioPlayer({
  reels,
  initialIndex,
  onQuizPress,
  onFlashcardPress,
  onBack,
}: {
  reels: ReelDto[];
  initialIndex: number;
  onQuizPress?: (topicId: string) => void;
  onFlashcardPress?: (topicId: string) => void;
  onBack?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, reels]);

  const reel = reels[activeIndex] || reels[0];
  const totalCount = reels.length;

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed);
  const watchedReels = useAppStore((s) => s.watchedReels);
  const markReelWatched = useAppStore((s) => s.markReelWatched);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsPlaying(true);
    videoRef.current?.playAsync().catch(() => {});
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    if (reel?.id) {
      markReelWatched(reel.id);
    }
  }, [reel?.id, playbackSpeed, markReelWatched]);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync().catch(() => {});
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const cycleSpeed = async () => {
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextSpeed = SPEED_OPTIONS[(currentIndex + 1) % SPEED_OPTIONS.length];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(nextSpeed, true).catch(() => {});
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const res = await educationApi.toggleBookmark(reel.topicId, reel.id);
      setIsSaved(res.bookmarked);
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks() });
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      educationApi.recordReelView(reel.id, {
        reelId: reel.id,
        watchDurationSec: Math.round(((status as any).durationMillis ?? 45000) / 1000),
        completed: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });
    }
  };

  const remainingCount = Math.max(0, totalCount - (activeIndex + 1));

  return (
    <View style={styles.desktopContainer}>
      {/* Top Header */}
      <View style={styles.desktopHeader}>
        <View style={styles.desktopHeaderLeft}>
          {onBack && (
            <Pressable onPress={onBack} style={styles.desktopBackButton}>
              <Icon name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.desktopBackText}>Back to Topic</Text>
            </Pressable>
          )}
          <View style={styles.desktopTopicPill}>
            <Text style={styles.desktopTopicText}>
              {reel.topic?.title ?? 'Revision Studio'}
            </Text>
          </View>
        </View>

        <ViewportToggle inline={true} />
      </View>

      {/* Main Studio Body: 2 Columns */}
      <View style={styles.desktopStudioBody}>
        {/* Left Column: Vertical Reel Player Card */}
        <View style={styles.desktopVideoCol}>
          <View style={styles.desktopPlayerCard}>
            <Pressable
              onPress={togglePlayPause}
              style={styles.desktopVideoPressable}
            >
              <Video
                ref={videoRef}
                source={{ uri: reel.videoUrl }}
                style={styles.desktopVideoElement}
                resizeMode={ResizeMode.COVER}
                isLooping={true}
                isMuted={isMuted}
                shouldPlay={isPlaying}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                useNativeControls={false}
              />

              {/* Pause Overlay Icon */}
              {!isPlaying && (
                <View style={styles.pauseOverlay}>
                  <View style={styles.pauseIconBadge}>
                    <Icon name="play" size={36} color="#FFFFFF" />
                  </View>
                </View>
              )}

              {/* Checkpoint Track Overlay inside Video */}
              <View style={[styles.trackContainer, { top: 16 }]}>
                <View style={styles.checkpointTrackRow}>
                  {Array.from({ length: totalCount }).map((_, i) => {
                    const targetReelId = reels[i]?.id;
                    const isPastOrWatched = i < activeIndex || (targetReelId && watchedReels[targetReelId]);
                    const isCurrent = i === activeIndex;
                    return (
                      <React.Fragment key={i}>
                        <Pressable
                          onPress={() => setActiveIndex(i)}
                          style={[
                            styles.checkpointDot,
                            isPastOrWatched && !isCurrent && styles.checkpointDotCompleted,
                            isCurrent && styles.checkpointDotCurrent,
                          ]}
                        >
                          {isPastOrWatched && !isCurrent && (
                            <Icon name="checkmark" size={10} color="#FFFFFF" />
                          )}
                          {isCurrent && <View style={styles.currentDotPulse} />}
                        </Pressable>

                        {i < totalCount - 1 && (
                          <View
                            style={[
                              styles.trackSegment,
                              i < activeIndex && styles.trackSegmentActive,
                            ]}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
                <View style={styles.trackSummaryRow}>
                  <Text style={styles.trackSummaryText}>
                    Checkpoint {activeIndex + 1} of {totalCount}
                  </Text>
                  <Text style={styles.trackRemainingText}>
                    {remainingCount === 0 ? '🎉 All watched!' : `${remainingCount} remaining`}
                  </Text>
                </View>
              </View>

              {/* Right Side Actions */}
              <View style={[styles.rightActionsContainer, { bottom: 90 }]}>
                <Pressable onPress={cycleSpeed} style={styles.actionCircleButton}>
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                  <Text style={styles.actionLabel}>Speed</Text>
                </Pressable>

                <Pressable onPress={toggleMute} style={styles.actionCircleButton}>
                  <Icon
                    name={isMuted ? 'volume-mute' : 'volume-high'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Audio'}</Text>
                </Pressable>

                <Pressable onPress={handleBookmarkToggle} style={styles.actionCircleButton}>
                  <Icon
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={isSaved ? '#FBBF24' : '#FFFFFF'}
                  />
                  <Text style={styles.actionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
                </Pressable>
              </View>

              {/* Bottom Details Overlay */}
              <View style={[styles.bottomOverlay, { bottom: 0, paddingBottom: 16 }]}>
                <View style={styles.chapterBadgeRow}>
                  <View style={styles.subjectTag}>
                    <Text style={styles.subjectTagText}>
                      {reel.subject?.name ?? 'Topic'}
                    </Text>
                  </View>
                  <Text style={styles.chapterSubtitleText} numberOfLines={1}>
                    {reel.chapter?.title ?? 'Module'}
                  </Text>
                </View>
                <Text style={[styles.reelTitleText, { fontSize: 15, marginBottom: 4 }]}>
                  {reel.title}
                </Text>
                <View style={styles.durationPill}>
                  <Icon name="time-outline" size={13} color="#CBD5E1" />
                  <Text style={styles.durationText}>{formatSeconds(reel.durationSec)}</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Reel Pager Switcher below Video */}
          <View style={styles.desktopPagerRow}>
            <Pressable
              onPress={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              style={[
                styles.desktopPagerButton,
                activeIndex === 0 && styles.desktopPagerButtonDisabled,
              ]}
            >
              <Icon
                name="chevron-back"
                size={16}
                color={activeIndex === 0 ? '#475569' : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.desktopPagerText,
                  activeIndex === 0 && styles.desktopPagerTextDisabled,
                ]}
              >
                Previous
              </Text>
            </Pressable>

            <Text style={styles.desktopPagerCount}>
              Reel {activeIndex + 1} of {totalCount}
            </Text>

            <Pressable
              onPress={() => setActiveIndex(Math.min(totalCount - 1, activeIndex + 1))}
              disabled={activeIndex === totalCount - 1}
              style={[
                styles.desktopPagerButton,
                activeIndex === totalCount - 1 && styles.desktopPagerButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.desktopPagerText,
                  activeIndex === totalCount - 1 && styles.desktopPagerTextDisabled,
                ]}
              >
                Next
              </Text>
              <Icon
                name="chevron-forward"
                size={16}
                color={activeIndex === totalCount - 1 ? '#475569' : '#FFFFFF'}
              />
            </Pressable>
          </View>
        </View>

        {/* Right Column: Pinned Revision Studio Panel */}
        <View style={styles.desktopStudioPanel}>
          <View style={styles.studioPanelHeader}>
            <Text style={styles.studioPanelTitle}>⚡ Interactive Revision Studio</Text>
            <Text style={styles.studioPanelSubtitle}>{reel.title}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.studioScroll}>
            {/* Core Interview Takeaway */}
            <View style={styles.modalTakeawayBanner}>
              <Text style={styles.modalTakeawayHeader}>🎯 CORE INTERVIEW TAKEAWAY</Text>
              <Text style={styles.modalTakeawayBody}>
                {reel.keyTakeaway ?? 'Master this mental model to confidently explain trade-offs during interviews.'}
              </Text>
            </View>

            {/* 30-Sec Pitch */}
            {reel.interviewPitch && (
              <View style={styles.modalPitchBanner}>
                <View style={styles.pitchHeaderRow}>
                  <Icon name="mic" size={15} color="#38BDF8" />
                  <Text style={styles.pitchHeaderText}>30-SECOND INTERVIEW PITCH</Text>
                </View>
                <Text style={styles.pitchSubheader}>Say this directly when asked by the interviewer:</Text>
                <Text style={styles.pitchBody}>"{reel.interviewPitch}"</Text>
              </View>
            )}

            {/* Architecture Flow Diagram */}
            {reel.architectureDiagram && (
              <View style={styles.modalDiagramContainer}>
                <View style={styles.diagramHeaderRow}>
                  <Icon name="git-network" size={15} color="#A78BFA" />
                  <Text style={styles.diagramHeaderText}>VISUAL ARCHITECTURE FLOW</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagramScroll}>
                  <Text style={styles.diagramMonospace}>
                    {reel.architectureDiagram.trim()}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* Pitfalls */}
            {reel.pitfalls && reel.pitfalls.length > 0 && (
              <View style={styles.modalPitfallsContainer}>
                <View style={styles.pitfallsHeaderRow}>
                  <Icon name="alert-circle" size={15} color="#F87171" />
                  <Text style={styles.pitfallsHeaderText}>INTERVIEW RED FLAGS (AVOID SAYING)</Text>
                </View>
                <View style={styles.pitfallsList}>
                  {reel.pitfalls.map((pitfall, pIdx) => (
                    <View key={pIdx} style={styles.pitfallRow}>
                      <Text style={styles.pitfallCross}>✗</Text>
                      <Text style={styles.pitfallText}>{pitfall}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Notes */}
            <Text style={styles.bulletSectionTitle}>Key Concepts & Notes</Text>
            <View style={styles.bulletsContainer}>
              {(reel.summaryNotes || []).map((note, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{note}</Text>
                </View>
              ))}
            </View>

            {/* Quiz CTA */}
            {onQuizPress && (
              <Pressable
                onPress={() => onQuizPress(reel.topicId)}
                style={[styles.modalQuizButton, { marginTop: 12, marginBottom: 20 }]}
              >
                <Text style={styles.modalQuizButtonText}>Take Practice Quiz Checkpoint →</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

// 🎬 Root Vertical Reel Player (Switches cleanly between Mobile and Desktop modes)
export function VerticalReelPlayer({
  reels,
  initialReelId,
  onQuizPress,
  onFlashcardPress,
  onBack,
}: VerticalReelPlayerProps) {
  const viewMode = useAppStore((s) => s.viewMode);
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  const initialIndex = initialReelId
    ? Math.max(0, reels.findIndex((r) => r.id === initialReelId))
    : 0;

  if (isDesktop) {
    return (
      <DesktopStudioPlayer
        reels={reels}
        initialIndex={initialIndex}
        onQuizPress={onQuizPress}
        onFlashcardPress={onFlashcardPress}
        onBack={onBack}
      />
    );
  }

  return (
    <MobileVerticalReelPlayer
      reels={reels}
      initialIndex={initialIndex}
      onQuizPress={onQuizPress}
      onFlashcardPress={onFlashcardPress}
      onBack={onBack}
    />
  );
}

const styles = StyleSheet.create({
  // Mobile Player Styles
  mobileOuterContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobilePlayerFrame: {
    width: '100%',
    maxWidth: 500,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0B0F19',
  },
  mobileVideoPressable: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileVideo: {
    width: '100%',
    height: '100%',
  },
  mobileTopHeader: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
    gap: 8,
  },
  mobileBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  mobileBackText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mobileTopicBadge: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  mobileTopicBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mobileTrackContainer: {
    position: 'absolute',
    top: 58,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 25,
  },
  mobileRightActions: {
    position: 'absolute',
    right: 12,
    bottom: 128,
    alignItems: 'center',
    gap: 12,
    zIndex: 25,
  },
  mobileBottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 46,
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
  },
  mobilePagerBar: {
    position: 'absolute',
    bottom: 6,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 30,
  },
  mobilePagerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mobilePagerBtnDisabled: {
    opacity: 0.35,
  },
  mobilePagerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  mobilePagerBtnTextDisabled: {
    color: '#64748B',
  },
  mobilePagerCountText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },

  // Desktop Player Styles
  desktopContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    width: '100%',
    minHeight: '100%',
  },
  desktopHeader: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  desktopHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desktopBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  desktopBackText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  desktopTopicPill: {
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.4)',
  },
  desktopTopicText: {
    color: '#A5B4FC',
    fontSize: 13,
    fontWeight: '700',
  },
  desktopStudioBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 28,
    maxWidth: 1200,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flex: 1,
  },
  desktopVideoCol: {
    alignItems: 'center',
  },
  desktopPlayerCard: {
    width: 400,
    height: 640,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  desktopVideoPressable: {
    width: 400,
    height: 640,
    position: 'relative',
  },
  desktopVideoElement: {
    width: 400,
    height: 640,
  },
  desktopPagerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 400,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  desktopPagerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  desktopPagerButtonDisabled: {
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  desktopPagerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  desktopPagerTextDisabled: {
    color: '#64748B',
  },
  desktopPagerCount: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  desktopStudioPanel: {
    flex: 1,
    maxWidth: 680,
    height: 692,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  studioPanelHeader: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  studioPanelTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studioPanelSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 3,
  },
  studioScroll: {
    flex: 1,
  },

  // Video State Overlays
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 10,
  },
  pauseIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Shared Track & Checkpoints
  trackContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  },
  checkpointTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkpointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkpointDotCompleted: {
    backgroundColor: '#10B981', // Emerald green
  },
  checkpointDotCurrent: {
    backgroundColor: '#6366F1', // Indigo glow
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.2 }],
  },
  currentDotPulse: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  trackSegment: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  trackSegmentActive: {
    backgroundColor: '#10B981',
  },
  trackSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  trackSummaryText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  trackRemainingText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },

  // Shared Action Buttons
  rightActionsContainer: {
    position: 'absolute',
    right: 14,
    bottom: 90,
    alignItems: 'center',
    gap: 14,
    zIndex: 20,
  },
  actionCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  speedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quizCircleButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#6366F1',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },

  // Shared Bottom Overlay
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 36,
    backgroundColor: 'rgba(0,0,0,0.65)',
    zIndex: 10,
  },
  chapterBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  subjectTag: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subjectTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  chapterSubtitleText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  reelTitleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 4,
  },
  takeawayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    marginBottom: 8,
  },
  takeawayText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sheetTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  sheetTriggerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  quizBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  quizBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Modal / Drawer Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalTakeawayBanner: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  modalTakeawayHeader: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalTakeawayBody: {
    color: '#E0E7FF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  modalPitchBanner: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  pitchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pitchHeaderText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pitchSubheader: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 6,
  },
  pitchBody: {
    color: '#F0F9FF',
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  modalDiagramContainer: {
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    padding: 14,
    marginBottom: 16,
  },
  diagramHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  diagramHeaderText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  diagramScroll: {
    marginTop: 4,
  },
  diagramMonospace: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#34D399',
    fontSize: 11,
    lineHeight: 16,
  },
  modalPitfallsContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    padding: 14,
    marginBottom: 16,
  },
  pitfallsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pitfallsHeaderText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pitfallsList: {
    gap: 8,
  },
  pitfallRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pitfallCross: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  pitfallText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  bulletSectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  bulletsContainer: {
    gap: 8,
    marginBottom: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    color: '#6366F1',
    fontSize: 14,
    lineHeight: 18,
  },
  bulletText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  modalActions: {
    gap: 10,
    marginTop: 8,
    marginBottom: 30,
  },
  modalQuizButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalDismissButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDismissText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
