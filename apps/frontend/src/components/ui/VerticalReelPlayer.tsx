import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  PanResponder,
} from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { Icon } from './Icon';
import { ViewportToggle } from './ViewportToggle';
import { ThemeToggle } from './ThemeToggle';
import { InteractiveSchematic } from './InteractiveSchematic';
import { BionicText, BionicToggle } from './BionicText';
import {
  ReelTimelineScrubber,
  ReelMicroCheckOverlay,
  ReelPitchTeleprompter,
  ReelGestureBadge,
} from './ReelEngagementOverlays';
import { educationApi } from '@/services/api/educationApi';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/queryKeys';
import type { ReelDto } from '@/services/api/types';
import type { ThemeColors } from '@/theme/types';

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

export interface CaptionSegment {
  startSec: number;
  endSec: number;
  text: string;
}

export function parseVtt(vttString: string): CaptionSegment[] {
  const lines = vttString.split(/\r?\n/);
  const segments: CaptionSegment[] = [];
  let currentStart = -1;
  let currentEnd = -1;
  let currentText = '';

  function timeToSec(tStr: string): number {
    const parts = tStr.split(':');
    if (parts.length === 3) {
      const h = parseFloat(parts[0]);
      const m = parseFloat(parts[1]);
      const s = parseFloat(parts[2]);
      return h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      const m = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      return m * 60 + s;
    }
    return 0;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->').map((s) => s.trim().split(' ')[0]);
      currentStart = timeToSec(startStr);
      currentEnd = timeToSec(endStr);
      currentText = '';
    } else if (line && currentStart >= 0) {
      currentText += (currentText ? ' ' : '') + line;
    } else if (!line && currentStart >= 0 && currentText) {
      segments.push({ startSec: currentStart, endSec: currentEnd, text: currentText });
      currentStart = -1;
      currentEnd = -1;
      currentText = '';
    }
  }

  if (currentStart >= 0 && currentText) {
    segments.push({ startSec: currentStart, endSec: currentEnd, text: currentText });
  }

  return segments;
}

export function getReelCaptionSegments(reel: ReelDto): CaptionSegment[] {
  if (reel.captions && reel.captions.length > 0) {
    return reel.captions;
  }

  const rawPieces: string[] = [];
  if (reel.keyTakeaway) {
    rawPieces.push(`🎯 Mental Model: ${reel.keyTakeaway}`);
  }
  if (reel.summaryNotes && reel.summaryNotes.length > 0) {
    reel.summaryNotes.forEach((n) => rawPieces.push(`⚡ ${n}`));
  }
  if (reel.interviewPitch) {
    rawPieces.push(`🎤 Interview Pitch: "${reel.interviewPitch}"`);
  }
  if (reel.pitfalls && reel.pitfalls.length > 0) {
    rawPieces.push(`⚠️ Red Flag: ${reel.pitfalls[0]}`);
  }

  if (rawPieces.length === 0) {
    rawPieces.push(`Master ${reel.title} with atomic clarity.`);
  }

  const duration = reel.durationSec || 45;
  const segmentDuration = Math.max(4, Math.floor(duration / rawPieces.length));
  const segments: CaptionSegment[] = [];

  rawPieces.forEach((text, i) => {
    const startSec = i * segmentDuration;
    const endSec = Math.min(duration, (i + 1) * segmentDuration);
    segments.push({ startSec, endSec, text });
  });

  return segments;
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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getReelStyles(colors, isDark), [colors, isDark]);

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
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.modalTitle}>⚡ Rapid Revision Cheat-Sheet</Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {reel.title}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <BionicToggle compact={true} />
                <ThemeToggle compact={true} />
                <Pressable onPress={onClose} style={styles.modalCloseButton}>
                  <Icon name="close" size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            {/* Key Takeaway Banner */}
            <View style={styles.modalTakeawayBanner}>
              <Text style={styles.modalTakeawayHeader}>🎯 CORE INTERVIEW TAKEAWAY</Text>
              <BionicText
                text={reel.keyTakeaway ?? 'Master this mental model to confidently explain trade-offs during interviews.'}
                style={styles.modalTakeawayBody}
              />
            </View>

            {/* 🎤 30-Second Verbatim Pitch */}
            {reel.interviewPitch && (
              <View style={styles.modalPitchBanner}>
                <View style={styles.pitchHeaderRow}>
                  <Icon name="mic" size={15} color={colors.accentText} />
                  <Text style={styles.pitchHeaderText}>30-SECOND INTERVIEW PITCH</Text>
                </View>
                <Text style={styles.pitchSubheader}>Say this directly when asked by the interviewer:</Text>
                <BionicText
                  text={`"${reel.interviewPitch}"`}
                  style={styles.pitchBody}
                />
              </View>
            )}

            {/* 📐 2040 Interactive System Schematic & Architecture Simulator */}
            <InteractiveSchematic
              title={reel.title}
              topicId={reel.topicId}
              asciiDiagram={reel.architectureDiagram}
            />

            {/* ⚠️ Interview Red Flags & Mistakes to Avoid */}
            {reel.pitfalls && reel.pitfalls.length > 0 && (
              <View style={styles.modalPitfallsContainer}>
                <View style={styles.pitfallsHeaderRow}>
                  <Icon name="alert-circle" size={15} color={colors.danger} />
                  <Text style={styles.pitfallsHeaderText}>INTERVIEW RED FLAGS (AVOID SAYING)</Text>
                </View>
                <View style={styles.pitfallsList}>
                  {reel.pitfalls.map((pitfall, pIdx) => (
                    <View key={pIdx} style={styles.pitfallRow}>
                      <Text style={styles.pitfallCross}>✗</Text>
                      <BionicText text={pitfall} style={styles.pitfallText} />
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
                  <BionicText text={note} style={styles.bulletText} />
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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getReelStyles(colors, isDark), [colors, isDark]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, reels]);

  const reel = reels[activeIndex] || reels[0];
  const totalCount = reels.length;

  const videoRef = useRef<Video>(null);
  const isPlayingRef = useRef<boolean>(true);
  const isTurboHoldRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [showMicroCheck, setShowMicroCheck] = useState<boolean>(false);
  const [showPitchMode, setShowPitchMode] = useState<boolean>(false);
  const [focusHud, setFocusHud] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [isTurboHold, setIsTurboHold] = useState<boolean>(false);
  const [gestureToast, setGestureToast] = useState<string | null>(null);
  const lastTapRef = useRef<number>(0);

  const triggerToast = useCallback((msg: string) => {
    setGestureToast(msg);
    setTimeout(() => {
      setGestureToast((prev) => (prev === msg ? null : prev));
    }, 1400);
  }, []);

  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed);
  const watchedReels = useAppStore((s) => s.watchedReels);
  const markReelWatched = useAppStore((s) => s.markReelWatched);
  const captionsEnabled = useAppStore((s) => s.captionsEnabled);
  const toggleCaptions = useAppStore((s) => s.toggleCaptions);
  const queryClient = useQueryClient();

  const [currentPlaybackMillis, setCurrentPlaybackMillis] = useState<number>(0);

  const captionSegments = useMemo(() => getReelCaptionSegments(reel), [reel]);
  const currentSec = Math.floor(currentPlaybackMillis / 1000);
  const activeCaption = useMemo(() => {
    return captionSegments.find((c) => currentSec >= c.startSec && currentSec < c.endSec)?.text;
  }, [captionSegments, currentSec]);

  const nextReel = activeIndex < totalCount - 1 ? reels[activeIndex + 1] : null;
  const prevReel = activeIndex > 0 ? reels[activeIndex - 1] : null;

  useEffect(() => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    videoRef.current?.playAsync().catch(() => {});
    // Browser autoplay policy may block audio: if the visible video is still paused shortly after,
    // fall back to muted playback so the reel still plays.
    const autoplayGuard =
      Platform.OS === 'web' && typeof document !== 'undefined'
        ? setTimeout(() => {
            if (!isPlayingRef.current) return;
            const blocked = Array.from(document.querySelectorAll('video')).some(
              (v) => v.clientWidth > 50 && v.paused && !v.muted
            );
            if (blocked) setIsMuted(true);
          }, 1500)
        : undefined;
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    if (reel?.id) {
      markReelWatched(reel.id);
    }
    return () => {
      if (autoplayGuard) clearTimeout(autoplayGuard);
    };
  }, [reel?.id, markReelWatched]);

  useEffect(() => {
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
  }, [playbackSpeed]);

  const togglePlayPause = () => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setIsPlaying(next);
    if (!next) {
      videoRef.current?.pauseAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try {
            v.pause();
          } catch {}
        });
      }
    } else {
      videoRef.current?.playAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          if (v.clientWidth > 50) {
            try {
              v.play().catch(() => {});
            } catch {}
          }
        });
      }
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
      triggerToast(res.bookmarked ? '⚡ Concept Locked in Vault!' : 'Removed from Vault');
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks() });
    } catch {
      const next = !isSaved;
      setIsSaved(next);
      triggerToast(next ? '⚡ Concept Locked in Vault!' : 'Removed from Vault');
    }
  };

  const handleSeek = useCallback(
    (targetSec: number) => {
      const ms = Math.max(0, targetSec * 1000);
      setCurrentPlaybackMillis(ms);
      videoRef.current?.setPositionAsync(ms).catch(() => {});
      triggerToast(`⏱️ Seeked to ${formatSeconds(targetSec)}`);
    },
    [triggerToast]
  );

  const handleVideoPress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      // Double-tap -> lock/bookmark concept
      if (!isSaved) {
        handleBookmarkToggle();
      } else {
        triggerToast('⚡ Concept Already Locked!');
      }
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
    togglePlayPause();
  };

  const handleLongPressStart = () => {
    isTurboHoldRef.current = true;
    setIsTurboHold(true);
    videoRef.current?.setRateAsync(2.0, true).catch(() => {});
  };

  const handleLongPressEnd = () => {
    if (isTurboHoldRef.current) {
      isTurboHoldRef.current = false;
      setIsTurboHold(false);
      videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsBuffering(true);
      return;
    }
    setIsBuffering(status.isBuffering);
    setCurrentPlaybackMillis((status as any).positionMillis ?? 0);

    // Prevent underlying video element from continuing playback while paused
    if (!isPlayingRef.current && (status as any).isPlaying) {
      videoRef.current?.pauseAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try {
            v.pause();
          } catch {}
        });
      }
      return;
    }

    if (status.didJustFinish) {
      educationApi.recordReelView(reel.id, {
        reelId: reel.id,
        watchDurationSec: Math.round(((status as any).durationMillis ?? 45000) / 1000),
        completed: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });
      if (autoAdvance) {
        if (activeIndex < totalCount - 1) {
          triggerToast('⏭️ Auto-Advancing to Next Reel...');
          setActiveIndex((prev) => prev + 1);
        } else {
          setShowMicroCheck(true);
        }
      }
    }
  };

  const remainingCount = Math.max(0, totalCount - (activeIndex + 1));

  // Seamless Next / Prev Navigation
  const goToNext = useCallback(() => {
    if (activeIndex < totalCount - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (onQuizPress) {
      onQuizPress(reel.topicId);
    }
  }, [activeIndex, totalCount, onQuizPress, reel.topicId]);

  const goToPrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  // Instagram-style Vertical Pan Responder (Touch swipe UP -> Next, swipe DOWN -> Prev)
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.2;
          return isVertical && Math.abs(gestureState.dy) > 10;
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -28) {
            goToNext();
          } else if (gestureState.dy > 28) {
            goToPrev();
          }
        },
      }),
    [goToNext, goToPrev]
  );

  // Mouse Wheel / Trackpad Scroll on Web (TikTok / Instagram web experience)
  useEffect(() => {
    if (isWeb && typeof window !== 'undefined') {
      let isThrottled = false;
      const handleWheel = (e: WheelEvent) => {
        if (isThrottled) return;
        if (e.deltaY > 20) {
          isThrottled = true;
          goToNext();
          setTimeout(() => { isThrottled = false; }, 400);
        } else if (e.deltaY < -20) {
          isThrottled = true;
          goToPrev();
          setTimeout(() => { isThrottled = false; }, 400);
        }
      };
      window.addEventListener('wheel', handleWheel, { passive: true });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, [goToNext, goToPrev, isWeb]);

  // Keyboard Navigation on Web (ArrowDown / ArrowUp / Space)
  useEffect(() => {
    if (isWeb && typeof window !== 'undefined') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          goToPrev();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToNext, goToPrev, isWeb]);

  return (
    <View style={styles.mobileOuterContainer}>
      <View style={styles.mobileColumnWrapper}>
        {/* 🔝 Solid Top Utility & Navigation Bar (Never floating over the reel video) */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            zIndex: 40,
          }}
        >
          {/* Universal Web Controls Row */}
          {isWeb && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderSubtle,
              }}
            >
              <ThemeToggle compact={true} />
              <ViewportToggle inline={true} />
            </View>
          )}

          {/* Reel Navigation & Topic Bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 12,
              paddingVertical: 8,
              gap: 8,
            }}
          >
            {onBack && (
              <Pressable onPress={onBack} style={styles.mobileBackButton}>
                <Icon name="arrow-back" size={15} color={colors.textPrimary} />
                <Text style={styles.mobileBackText}>Back</Text>
              </Pressable>
            )}

            <View style={{ flex: 1, paddingHorizontal: 4 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 13,
                  fontWeight: '700',
                }}
                numberOfLines={1}
              >
                {reel.topic?.title ?? 'Revision Reel'}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 10,
                  fontWeight: '600',
                  marginTop: 1,
                }}
                numberOfLines={1}
              >
                Checkpoint {activeIndex + 1} of {totalCount} •{' '}
                {remainingCount === 0 ? 'All watched' : `${remainingCount} left`}
              </Text>
            </View>

            {/* Auto-Next vs Loop Toggle */}
            <Pressable
              onPress={() => {
                const next = !autoAdvance;
                setAutoAdvance(next);
                triggerToast(next ? '⏭️ Auto-Advance Playlist ON' : '🔁 Single-Reel Loop ON');
              }}
              style={[
                styles.mobileBackButton,
                autoAdvance && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '800',
                  color: autoAdvance ? colors.primaryText : colors.textSecondary,
                }}
              >
                {autoAdvance ? '⏭️ Auto' : '🔁 Loop'}
              </Text>
            </Pressable>

            {/* Focus / Cinema HUD Toggle */}
            <Pressable
              onPress={() => {
                const next = !focusHud;
                setFocusHud(next);
                triggerToast(next ? '👁️ Focus HUD Active' : 'HUD Restored');
              }}
              style={[
                styles.mobileBackButton,
                focusHud && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
              ]}
            >
              <Icon
                name={focusHud ? 'eye-off-outline' : 'eye-outline'}
                size={14}
                color={focusHud ? colors.primaryText : colors.textPrimary}
              />
            </Pressable>
          </View>

          {/* Segmented Checkpoint Bar along bottom edge of header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 12,
              paddingBottom: 6,
            }}
          >
            {Array.from({ length: totalCount }).map((_, i) => {
              const targetReelId = reels[i]?.id;
              const isPastOrWatched =
                i < activeIndex || (targetReelId && watchedReels[targetReelId]);
              const isCurrent = i === activeIndex;
              return (
                <Pressable
                  key={i}
                  onPress={() => setActiveIndex(i)}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: isCurrent
                      ? colors.primary
                      : isPastOrWatched
                      ? colors.success
                      : colors.border,
                  }}
                />
              );
            })}
          </View>
        </View>

        <View
          style={styles.mobilePlayerFrame}
          {...panResponder.panHandlers}
        >
          {/* Background Video Pre-fetch Engine for Zero-Buffering */}
          <View style={styles.preloaderHidden} pointerEvents="none">
            {nextReel && (
              <Video
                source={{ uri: nextReel.videoUrl }}
                style={styles.preloaderVideo}
                shouldPlay={false}
                isMuted={true}
                positionMillis={0}
              />
            )}
            {prevReel && (
              <Video
                source={{ uri: prevReel.videoUrl }}
                style={styles.preloaderVideo}
                shouldPlay={false}
                isMuted={true}
                positionMillis={0}
              />
            )}
          </View>

          {/* Full Video Area (Tap to play/pause, Double-Tap to Bookmark, Hold for 2.0x Turbo) */}
          <Pressable
            onPress={handleVideoPress}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
            delayLongPress={240}
            style={styles.mobileVideoPressable}
          >
            <Video
              ref={videoRef}
              source={{ uri: reel.videoUrl }}
              style={styles.mobileVideo}
              resizeMode={ResizeMode.COVER}
              isLooping={!autoAdvance}
              isMuted={isMuted}
              shouldPlay={isPlaying}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              useNativeControls={false}
            />

            {/* Buffering Indicator */}
            {isBuffering && (
              <View style={styles.bufferingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}

            {/* Pause Overlay Icon */}
            {!isPlaying && !isBuffering && (
              <View style={styles.pauseOverlay}>
                <View style={styles.pauseIconBadge}>
                  <Icon name="play" size={36} color={colors.textPrimary} />
                </View>
              </View>
            )}
          </Pressable>

          {/* ⚡ Tactile Gesture & 2.0x Turbo Hold Toast */}
          <ReelGestureBadge message={gestureToast} isTurboHold={isTurboHold} />

          {/* ⚡ Active Recall 10s Micro-Check Card */}
          <ReelMicroCheckOverlay
            reel={reel}
            visible={showMicroCheck}
            onClose={() => setShowMicroCheck(false)}
            onCorrect={() => triggerToast('🎉 +15 Synaptic XP Earned!')}
          />

          {/* 🎤 30s Verbatim Interview Pitch Teleprompter */}
          <ReelPitchTeleprompter
            reel={reel}
            visible={showPitchMode}
            onClose={() => setShowPitchMode(false)}
          />

          {/* 👉 Right Side Action Controls (Hidden when Focus HUD is active) */}
          {!focusHud && (
            <View style={styles.mobileRightActions}>
              {/* Mute toggle */}
              <Pressable onPress={toggleMute} style={styles.actionCircleButton}>
                <Icon
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={18}
                  color={colors.textPrimary}
                />
                <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Audio'}</Text>
              </Pressable>

              {/* Speed switcher (1x, 1.25x, 1.5x, 2x) */}
              <Pressable onPress={cycleSpeed} style={styles.actionCircleButton}>
                <Text style={styles.speedText}>{isTurboHold ? '2.0x' : `${playbackSpeed}x`}</Text>
                <Text style={styles.actionLabel}>Speed</Text>
              </Pressable>

              {/* Closed Captions toggle */}
              <Pressable
                onPress={toggleCaptions}
                style={[
                  styles.actionCircleButton,
                  captionsEnabled && styles.actionCircleButtonActive,
                ]}
              >
                <View style={styles.ccBadgeContainer}>
                  <Text
                    style={[
                      styles.ccBadgeText,
                      captionsEnabled && { color: colors.primaryText, fontWeight: '800' },
                    ]}
                  >
                    CC
                  </Text>
                </View>
                <Text
                  style={[
                    styles.actionLabel,
                    captionsEnabled && { color: colors.primaryText, fontWeight: '700' },
                  ]}
                >
                  {captionsEnabled ? 'CC On' : 'CC Off'}
                </Text>
              </Pressable>

              {/* ⚡ 10s Active Recall Micro-Check Button */}
              <Pressable
                onPress={() => {
                  setShowPitchMode(false);
                  setShowMicroCheck((prev) => !prev);
                }}
                style={[
                  styles.actionCircleButton,
                  showMicroCheck && styles.actionCircleButtonActive,
                ]}
              >
                <Icon
                  name="flash"
                  size={18}
                  color={showMicroCheck ? colors.primaryText : colors.warning}
                />
                <Text style={styles.actionLabel}>Check</Text>
              </Pressable>

              {/* 🎤 30s Pitch Teleprompter Button */}
              <Pressable
                onPress={() => {
                  setShowMicroCheck(false);
                  setShowPitchMode((prev) => !prev);
                }}
                style={[
                  styles.actionCircleButton,
                  showPitchMode && styles.actionCircleButtonActive,
                ]}
              >
                <Icon
                  name="mic"
                  size={18}
                  color={showPitchMode ? colors.primaryText : colors.accentTealText}
                />
                <Text style={styles.actionLabel}>Pitch</Text>
              </Pressable>

              {/* Bookmark Button */}
              <Pressable onPress={handleBookmarkToggle} style={styles.actionCircleButton}>
                <Icon
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={isSaved ? colors.warning : colors.textPrimary}
                />
                <Text style={styles.actionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
              </Pressable>
            </View>
          )}

          {/* 💬 Synchronized Subtitles / Closed Captions Overlay */}
          {captionsEnabled && !!activeCaption && (
            <View style={styles.captionOverlayContainer} pointerEvents="none">
              <View style={styles.captionPill}>
                <Text style={styles.captionText}>{activeCaption}</Text>
              </View>
            </View>
          )}

          {/* 🔻 Bottom Details, Timeline Scrubber & Key Takeaway Overlay */}
          {!focusHud && (
            <View style={styles.mobileBottomOverlay} pointerEvents="box-none">
              <ReelTimelineScrubber
                currentSec={currentSec}
                durationSec={reel.durationSec}
                onSeek={handleSeek}
                compact
              />

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

              <Text style={styles.reelTitleText} numberOfLines={2}>
                {reel.title}
              </Text>

              <View style={styles.bottomMetaRow}>
                <View style={styles.durationPill}>
                  <Icon name="time-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.durationText}>
                    {formatSeconds(currentSec)} / {formatSeconds(reel.durationSec)}
                  </Text>
                </View>

                <View style={styles.actionButtonsRow}>
                  {/* Cheat Sheet Quick View */}
                  <Pressable
                    onPress={() => setShowNotesDrawer(true)}
                    style={styles.sheetTriggerButton}
                  >
                    <Icon name="reader-outline" size={14} color={colors.textPrimary} />
                    <Text style={styles.sheetTriggerText}>Cheat Sheet</Text>
                  </Pressable>

                  {/* Quiz Banner */}
                  {onQuizPress && (
                    <Pressable
                      onPress={() => onQuizPress(reel.topicId)}
                      style={styles.quizBannerButton}
                    >
                      <Icon name="school-outline" size={14} color={colors.textInverse} />
                      <Text style={styles.quizBannerText}>Take Quiz</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          )}

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
                color={activeIndex === 0 ? colors.textMuted : colors.textPrimary}
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
                color={activeIndex === totalCount - 1 ? colors.textMuted : colors.textPrimary}
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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getReelStyles(colors, isDark), [colors, isDark]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, reels]);

  const reel = reels[activeIndex] || reels[0];
  const totalCount = reels.length;

  const videoRef = useRef<Video>(null);
  const isPlayingRef = useRef<boolean>(true);
  const isTurboHoldRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showMicroCheck, setShowMicroCheck] = useState<boolean>(false);
  const [showPitchMode, setShowPitchMode] = useState<boolean>(false);
  const [focusHud, setFocusHud] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [isTurboHold, setIsTurboHold] = useState<boolean>(false);
  const [gestureToast, setGestureToast] = useState<string | null>(null);
  const lastTapRef = useRef<number>(0);

  const triggerToast = useCallback((msg: string) => {
    setGestureToast(msg);
    setTimeout(() => {
      setGestureToast((prev) => (prev === msg ? null : prev));
    }, 1400);
  }, []);

  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed);
  const watchedReels = useAppStore((s) => s.watchedReels);
  const markReelWatched = useAppStore((s) => s.markReelWatched);
  const captionsEnabled = useAppStore((s) => s.captionsEnabled);
  const toggleCaptions = useAppStore((s) => s.toggleCaptions);
  const queryClient = useQueryClient();

  const [currentPlaybackMillis, setCurrentPlaybackMillis] = useState<number>(0);

  const captionSegments = useMemo(() => getReelCaptionSegments(reel), [reel]);
  const currentSec = Math.floor(currentPlaybackMillis / 1000);
  const activeCaption = useMemo(() => {
    return captionSegments.find((c) => currentSec >= c.startSec && currentSec < c.endSec)?.text;
  }, [captionSegments, currentSec]);

  const nextReel = activeIndex < totalCount - 1 ? reels[activeIndex + 1] : null;
  const prevReel = activeIndex > 0 ? reels[activeIndex - 1] : null;

  useEffect(() => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    videoRef.current?.playAsync().catch(() => {});
    // Browser autoplay policy may block audio: if the visible video is still paused shortly after,
    // fall back to muted playback so the reel still plays.
    const autoplayGuard =
      Platform.OS === 'web' && typeof document !== 'undefined'
        ? setTimeout(() => {
            if (!isPlayingRef.current) return;
            const blocked = Array.from(document.querySelectorAll('video')).some(
              (v) => v.clientWidth > 50 && v.paused && !v.muted
            );
            if (blocked) setIsMuted(true);
          }, 1500)
        : undefined;
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    if (reel?.id) {
      markReelWatched(reel.id);
    }
    return () => {
      if (autoplayGuard) clearTimeout(autoplayGuard);
    };
  }, [reel?.id, markReelWatched]);

  useEffect(() => {
    videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
  }, [playbackSpeed]);

  const togglePlayPause = () => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setIsPlaying(next);
    if (!next) {
      videoRef.current?.pauseAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try {
            v.pause();
          } catch {}
        });
      }
    } else {
      videoRef.current?.playAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          if (v.clientWidth > 50) {
            try {
              v.play().catch(() => {});
            } catch {}
          }
        });
      }
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
      triggerToast(res.bookmarked ? '⚡ Concept Locked in Vault!' : 'Removed from Vault');
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks() });
    } catch {
      const next = !isSaved;
      setIsSaved(next);
      triggerToast(next ? '⚡ Concept Locked in Vault!' : 'Removed from Vault');
    }
  };

  const handleSeek = useCallback(
    (targetSec: number) => {
      const ms = Math.max(0, targetSec * 1000);
      setCurrentPlaybackMillis(ms);
      videoRef.current?.setPositionAsync(ms).catch(() => {});
      triggerToast(`⏱️ Seeked to ${formatSeconds(targetSec)}`);
    },
    [triggerToast]
  );

  const handleVideoPress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      // Double-tap -> lock/bookmark concept
      if (!isSaved) {
        handleBookmarkToggle();
      } else {
        triggerToast('⚡ Concept Already Locked!');
      }
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
    togglePlayPause();
  };

  const handleLongPressStart = () => {
    isTurboHoldRef.current = true;
    setIsTurboHold(true);
    videoRef.current?.setRateAsync(2.0, true).catch(() => {});
  };

  const handleLongPressEnd = () => {
    if (isTurboHoldRef.current) {
      isTurboHoldRef.current = false;
      setIsTurboHold(false);
      videoRef.current?.setRateAsync(playbackSpeed, true).catch(() => {});
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsBuffering(true);
      return;
    }
    setIsBuffering(status.isBuffering);
    setCurrentPlaybackMillis((status as any).positionMillis ?? 0);

    // Prevent underlying video element from continuing playback while paused
    if (!isPlayingRef.current && (status as any).isPlaying) {
      videoRef.current?.pauseAsync().catch(() => {});
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try {
            v.pause();
          } catch {}
        });
      }
      return;
    }

    if (status.didJustFinish) {
      educationApi.recordReelView(reel.id, {
        reelId: reel.id,
        watchDurationSec: Math.round(((status as any).durationMillis ?? 45000) / 1000),
        completed: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });
      if (autoAdvance) {
        if (activeIndex < totalCount - 1) {
          triggerToast('⏭️ Auto-Advancing to Next Reel...');
          setActiveIndex((prev) => prev + 1);
        } else {
          setShowMicroCheck(true);
        }
      }
    }
  };

  const goToNext = useCallback(() => {
    if (activeIndex < totalCount - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (onQuizPress) {
      onQuizPress(reel.topicId);
    }
  }, [activeIndex, totalCount, onQuizPress, reel.topicId]);

  const goToPrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.2;
          return isVertical && Math.abs(gestureState.dy) > 10;
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -28) {
            goToNext();
          } else if (gestureState.dy > 28) {
            goToPrev();
          }
        },
      }),
    [goToNext, goToPrev]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isThrottled = false;
    const handleWheel = (e: WheelEvent) => {
      if (isThrottled) return;
      if (e.deltaY > 20) {
        isThrottled = true;
        goToNext();
        setTimeout(() => { isThrottled = false; }, 400);
      } else if (e.deltaY < -20) {
        isThrottled = true;
        goToPrev();
        setTimeout(() => { isThrottled = false; }, 400);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNext, goToPrev]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const remainingCount = Math.max(0, totalCount - (activeIndex + 1));

  return (
    <View style={styles.desktopContainer}>
      {/* Top Header */}
      <View style={styles.desktopHeader}>
        <View style={styles.desktopHeaderLeft}>
          {onBack && (
            <Pressable onPress={onBack} style={styles.desktopBackButton}>
              <Icon name="arrow-back" size={16} color={colors.textPrimary} />
              <Text style={styles.desktopBackText}>Back to Topic</Text>
            </Pressable>
          )}
          <View style={styles.desktopTopicPill}>
            <Text style={styles.desktopTopicText}>
              {reel.topic?.title ?? 'Revision Studio'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* Auto-Next vs Loop Toggle */}
          <Pressable
            onPress={() => {
              const next = !autoAdvance;
              setAutoAdvance(next);
              triggerToast(next ? '⏭️ Auto-Advance Playlist ON' : '🔁 Single-Reel Loop ON');
            }}
            style={[
              styles.desktopBackButton,
              autoAdvance && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: autoAdvance ? colors.primaryText : colors.textSecondary,
              }}
            >
              {autoAdvance ? '⏭️ Auto-Next ON' : '🔁 Loop Reel'}
            </Text>
          </Pressable>

          {/* Focus / Cinema HUD Toggle */}
          <Pressable
            onPress={() => {
              const next = !focusHud;
              setFocusHud(next);
              triggerToast(next ? '👁️ Focus HUD Active' : 'HUD Restored');
            }}
            style={[
              styles.desktopBackButton,
              focusHud && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
            ]}
          >
            <Icon
              name={focusHud ? 'eye-off-outline' : 'eye-outline'}
              size={15}
              color={focusHud ? colors.primaryText : colors.textPrimary}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: focusHud ? colors.primaryText : colors.textPrimary,
              }}
            >
              {focusHud ? 'Exit Focus' : 'Focus HUD'}
            </Text>
          </Pressable>

          <ThemeToggle />
          <ViewportToggle inline={true} />
        </View>
      </View>

      {/* Main Studio Body: 2 Columns */}
      <View style={styles.desktopStudioBody}>
        {/* Left Column: Vertical Reel Player Card */}
        <View style={styles.desktopVideoCol}>
          <View style={styles.desktopPlayerCard} {...panResponder.panHandlers}>
            {/* Background Video Pre-fetch Engine for Zero-Buffering */}
            <View style={styles.preloaderHidden} pointerEvents="none">
              {nextReel && (
                <Video
                  source={{ uri: nextReel.videoUrl }}
                  style={styles.preloaderVideo}
                  shouldPlay={false}
                  isMuted={true}
                  positionMillis={0}
                />
              )}
              {prevReel && (
                <Video
                  source={{ uri: prevReel.videoUrl }}
                  style={styles.preloaderVideo}
                  shouldPlay={false}
                  isMuted={true}
                  positionMillis={0}
                />
              )}
            </View>

            <Pressable
              onPress={handleVideoPress}
              onLongPress={handleLongPressStart}
              onPressOut={handleLongPressEnd}
              delayLongPress={240}
              style={styles.desktopVideoPressable}
            >
              <Video
                ref={videoRef}
                source={{ uri: reel.videoUrl }}
                style={styles.desktopVideoElement}
                resizeMode={ResizeMode.COVER}
                isLooping={!autoAdvance}
                isMuted={isMuted}
                shouldPlay={isPlaying}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                useNativeControls={false}
              />

              {/* Buffering Indicator */}
              {isBuffering && (
                <View style={styles.bufferingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}

              {/* Pause Overlay Icon */}
              {!isPlaying && !isBuffering && (
                <View style={styles.pauseOverlay}>
                  <View style={styles.pauseIconBadge}>
                    <Icon name="play" size={36} color={colors.textPrimary} />
                  </View>
                </View>
              )}
            </Pressable>

            {/* ⚡ Tactile Gesture & 2.0x Turbo Hold Toast */}
            <ReelGestureBadge message={gestureToast} isTurboHold={isTurboHold} />

            {/* ⚡ Active Recall 10s Micro-Check Card */}
            <ReelMicroCheckOverlay
              reel={reel}
              visible={showMicroCheck}
              onClose={() => setShowMicroCheck(false)}
              onCorrect={() => triggerToast('🎉 +15 Synaptic XP Earned!')}
            />

            {/* 🎤 30s Verbatim Interview Pitch Teleprompter */}
            <ReelPitchTeleprompter
              reel={reel}
              visible={showPitchMode}
              onClose={() => setShowPitchMode(false)}
            />

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
                          <Icon name="checkmark" size={10} color={colors.textInverse} />
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

            {/* Right Side Actions (Hidden when Focus HUD is active) */}
            {!focusHud && (
              <View style={[styles.rightActionsContainer, { bottom: 118 }]}>
                <Pressable onPress={cycleSpeed} style={styles.actionCircleButton}>
                  <Text style={styles.speedText}>{isTurboHold ? '2.0x' : `${playbackSpeed}x`}</Text>
                  <Text style={styles.actionLabel}>Speed</Text>
                </Pressable>

                {/* Closed Captions toggle */}
                <Pressable
                  onPress={toggleCaptions}
                  style={[
                    styles.actionCircleButton,
                    captionsEnabled && styles.actionCircleButtonActive,
                  ]}
                >
                  <View style={styles.ccBadgeContainer}>
                    <Text
                      style={[
                        styles.ccBadgeText,
                        captionsEnabled && { color: colors.primaryText, fontWeight: '800' },
                      ]}
                    >
                      CC
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      captionsEnabled && { color: colors.primaryText, fontWeight: '700' },
                    ]}
                  >
                    {captionsEnabled ? 'CC On' : 'CC Off'}
                  </Text>
                </Pressable>

                {/* ⚡ 10s Active Recall Micro-Check Button */}
                <Pressable
                  onPress={() => {
                    setShowPitchMode(false);
                    setShowMicroCheck((prev) => !prev);
                  }}
                  style={[
                    styles.actionCircleButton,
                    showMicroCheck && styles.actionCircleButtonActive,
                  ]}
                >
                  <Icon
                    name="flash"
                    size={19}
                    color={showMicroCheck ? colors.primaryText : colors.warning}
                  />
                  <Text style={styles.actionLabel}>Check</Text>
                </Pressable>

                {/* 🎤 30s Pitch Teleprompter Button */}
                <Pressable
                  onPress={() => {
                    setShowMicroCheck(false);
                    setShowPitchMode((prev) => !prev);
                  }}
                  style={[
                    styles.actionCircleButton,
                    showPitchMode && styles.actionCircleButtonActive,
                  ]}
                >
                  <Icon
                    name="mic"
                    size={19}
                    color={showPitchMode ? colors.primaryText : colors.accentTealText}
                  />
                  <Text style={styles.actionLabel}>Pitch</Text>
                </Pressable>

                <Pressable onPress={toggleMute} style={styles.actionCircleButton}>
                  <Icon
                    name={isMuted ? 'volume-mute' : 'volume-high'}
                    size={20}
                    color={colors.textPrimary}
                  />
                  <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Audio'}</Text>
                </Pressable>

                <Pressable onPress={handleBookmarkToggle} style={styles.actionCircleButton}>
                  <Icon
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={isSaved ? colors.warning : colors.textPrimary}
                  />
                  <Text style={styles.actionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
                </Pressable>
              </View>
            )}

            {/* 💬 Synchronized Subtitles / Closed Captions Overlay */}
            {captionsEnabled && !!activeCaption && (
              <View style={styles.desktopCaptionOverlayContainer} pointerEvents="none">
                <View style={styles.captionPill}>
                  <Text style={styles.captionText}>{activeCaption}</Text>
                </View>
              </View>
            )}

            {/* Bottom Details & Timeline Scrubber Overlay */}
            {!focusHud && (
              <View style={[styles.bottomOverlay, { bottom: 0, paddingBottom: 14, paddingTop: 18 }]}>
                <ReelTimelineScrubber
                  currentSec={currentSec}
                  durationSec={reel.durationSec}
                  onSeek={handleSeek}
                  compact
                />
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
                  <Icon name="time-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.durationText}>
                    {formatSeconds(currentSec)} / {formatSeconds(reel.durationSec)}
                  </Text>
                </View>
              </View>
            )}
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
                color={activeIndex === 0 ? colors.textMuted : colors.textPrimary}
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
                color={activeIndex === totalCount - 1 ? colors.textMuted : colors.textPrimary}
              />
            </Pressable>
          </View>
        </View>

        {/* Right Column: Pinned Revision Studio Panel */}
        <View style={styles.desktopStudioPanel}>
          <View style={[styles.studioPanelHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.studioPanelTitle}>⚡ 2040 Interactive Revision Studio</Text>
              <Text style={styles.studioPanelSubtitle} numberOfLines={1}>{reel.title}</Text>
            </View>
            <BionicToggle />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.studioScroll}>
            {/* Core Interview Takeaway */}
            <View style={styles.modalTakeawayBanner}>
              <Text style={styles.modalTakeawayHeader}>🎯 CORE INTERVIEW TAKEAWAY</Text>
              <BionicText
                text={reel.keyTakeaway ?? 'Master this mental model to confidently explain trade-offs during interviews.'}
                style={styles.modalTakeawayBody}
              />
            </View>

            {/* 📐 2040 Interactive Live System Schematic Simulator */}
            <InteractiveSchematic
              title={reel.title}
              topicId={reel.topicId}
              asciiDiagram={reel.architectureDiagram}
            />

            {/* ⏱️ Scrubbable Time-Synced Neural Transcript Matrix */}
            <View
              style={{
                backgroundColor: colors.surfaceSubtle,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                borderTopColor: colors.borderSpecular,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="pulse" size={14} color={colors.telemetryMono} />
                  <Text style={[styles.diagramHeaderText, { color: colors.textPrimary }]}>
                    TIME-SYNCED INTERACTIVE TRANSCRIPT (CLICK TO SEEK)
                  </Text>
                </View>
                <Text style={{ fontSize: 10, fontWeight: '800', color: colors.telemetryMono }}>
                  T+{currentSec}s
                </Text>
              </View>
              <View style={{ gap: 6 }}>
                {captionSegments.map((seg, sIdx) => {
                  const isActiveCue = currentSec >= seg.startSec && currentSec < seg.endSec;
                  return (
                    <Pressable
                      key={sIdx}
                      onPress={() => {
                        setCurrentPlaybackMillis(seg.startSec * 1000);
                        videoRef.current?.setPositionAsync(seg.startSec * 1000).catch(() => {});
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 8,
                        paddingVertical: 7,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        borderLeftWidth: 3,
                        borderLeftColor: isActiveCue ? colors.primary : colors.border,
                        backgroundColor: isActiveCue ? colors.primarySoft : colors.surface,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 6,
                          backgroundColor: isActiveCue ? colors.primary : colors.surfaceSubtle,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: '800',
                            color: isActiveCue ? colors.textInverse : colors.telemetryMono,
                          }}
                        >
                          {formatSeconds(seg.startSec)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <BionicText
                          text={seg.text}
                          style={{
                            fontSize: 12,
                            lineHeight: 17,
                            color: isActiveCue ? colors.textPrimary : colors.textSecondary,
                          }}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 30-Sec Pitch */}
            {reel.interviewPitch && (
              <View style={styles.modalPitchBanner}>
                <View style={styles.pitchHeaderRow}>
                  <Icon name="mic" size={15} color={colors.accentText} />
                  <Text style={styles.pitchHeaderText}>30-SECOND INTERVIEW PITCH</Text>
                </View>
                <Text style={styles.pitchSubheader}>Say this directly when asked by the interviewer:</Text>
                <BionicText
                  text={`"${reel.interviewPitch}"`}
                  style={styles.pitchBody}
                />
              </View>
            )}

            {/* Pitfalls */}
            {reel.pitfalls && reel.pitfalls.length > 0 && (
              <View style={styles.modalPitfallsContainer}>
                <View style={styles.pitfallsHeaderRow}>
                  <Icon name="alert-circle" size={15} color={colors.danger} />
                  <Text style={styles.pitfallsHeaderText}>INTERVIEW RED FLAGS (AVOID SAYING)</Text>
                </View>
                <View style={styles.pitfallsList}>
                  {reel.pitfalls.map((pitfall, pIdx) => (
                    <View key={pIdx} style={styles.pitfallRow}>
                      <Text style={styles.pitfallCross}>✗</Text>
                      <BionicText text={pitfall} style={styles.pitfallText} />
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
                  <BionicText text={note} style={styles.bulletText} />
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

// 🎨 Theme-Aware Stylesheet Generator (Light, Dark, and Grey modes)
function getReelStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    // Mobile Player Styles
    mobileOuterContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: colors.canvasBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mobileColumnWrapper: {
      flex: 1,
      width: '100%',
      maxWidth: 500,
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#000000',
      borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
      borderRightWidth: Platform.OS === 'web' ? 1 : 0,
      borderColor: colors.border,
    },
    mobilePlayerFrame: {
      flex: 1,
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#000000',
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
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.78)' : 'rgba(255, 255, 255, 0.88)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mobileBackText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    mobileTopicBadge: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.78)' : 'rgba(255, 255, 255, 0.88)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    mobileTopicBadgeText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    mobileTrackContainer: {
      position: 'absolute',
      top: 58,
      left: 14,
      right: 14,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.94)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 25,
    },
    mobileRightActions: {
      position: 'absolute',
      right: 12,
      bottom: 176,
      alignItems: 'center',
      gap: 10,
      zIndex: 25,
    },
    mobileBottomOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 46,
      paddingHorizontal: 14,
      paddingBottom: 10,
      paddingTop: 12,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.95)',
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.94)' : 'rgba(255, 255, 255, 0.96)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 30,
    },
    mobilePagerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mobilePagerBtnDisabled: {
      opacity: 0.35,
    },
    mobilePagerBtnText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '600',
    },
    mobilePagerBtnTextDisabled: {
      color: colors.textMuted,
    },
    mobilePagerCountText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '700',
    },
    swipeHintPill: {
      position: 'absolute',
      top: 72,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.94)',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 22,
    },
    swipeHintText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    floatingArrowBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.82)' : 'rgba(255, 255, 255, 0.9)',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.35 : 0.12,
      shadowRadius: 4,
    },

    // Desktop Player Styles
    desktopContainer: {
      flex: 1,
      backgroundColor: colors.screenBg,
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
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    desktopBackText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    desktopTopicPill: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    desktopTopicText: {
      color: colors.primaryText,
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
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.28 : 0.12,
      shadowRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopColor: colors.borderSpecular,
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
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    desktopPagerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
    },
    desktopPagerButtonDisabled: {
      backgroundColor: 'transparent',
      opacity: 0.35,
    },
    desktopPagerText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    desktopPagerTextDisabled: {
      color: colors.textMuted,
    },
    desktopPagerCount: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    desktopStudioPanel: {
      flex: 1,
      maxWidth: 680,
      height: 692,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopColor: colors.borderSpecular,
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: 16,
    },
    studioPanelHeader: {
      marginBottom: 16,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    studioPanelTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
    },
    studioPanelSubtitle: {
      color: colors.textMuted,
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
      backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)',
      zIndex: 10,
    },
    pauseOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(15,23,42,0.25)',
      zIndex: 10,
    },
    pauseIconBadge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Shared Track & Checkpoints
    trackContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.94)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkpointDotCompleted: {
      backgroundColor: colors.success,
    },
    checkpointDotCurrent: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.textInverse,
      transform: [{ scale: 1.2 }],
    },
    currentDotPulse: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textInverse,
    },
    trackSegment: {
      flex: 1,
      height: 3,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.1)',
      marginHorizontal: 4,
      borderRadius: 2,
    },
    trackSegmentActive: {
      backgroundColor: colors.success,
    },
    trackSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    trackSummaryText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '600',
    },
    trackRemainingText: {
      color: colors.textMuted,
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
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.82)' : 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionCircleButtonActive: {
      backgroundColor: isDark ? 'rgba(79, 70, 229, 0.28)' : 'rgba(99, 102, 241, 0.18)',
      borderColor: colors.primary,
    },
    ccBadgeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    ccBadgeText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    speedText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: 'bold',
    },
    quizCircleButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primaryBorder,
    },
    actionLabel: {
      color: colors.textPrimary,
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
      backgroundColor: isDark ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.95)',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      zIndex: 10,
    },
    chapterBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    subjectTag: {
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    subjectTagText: {
      color: colors.primaryText,
      fontSize: 11,
      fontWeight: 'bold',
    },
    chapterSubtitleText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
      flex: 1,
    },
    reelTitleText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: 'bold',
      lineHeight: 20,
      marginBottom: 4,
    },
    takeawayPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.warningSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(217, 119, 6, 0.3)',
      marginBottom: 8,
    },
    takeawayText: {
      color: colors.warningText,
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
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    durationText: {
      color: colors.textSecondary,
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
      backgroundColor: colors.surfaceSubtle,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sheetTriggerText: {
      color: colors.textPrimary,
      fontSize: 11,
      fontWeight: '600',
    },
    quizBannerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    quizBannerText: {
      color: colors.textInverse,
      fontSize: 11,
      fontWeight: 'bold',
    },

    // Modal / Drawer Styles
    modalBackdrop: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.72)' : 'rgba(15, 23, 42, 0.45)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '85%',
      paddingBottom: 28,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 12,
    },
    modalHeader: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalDragHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: 10,
    },
    modalTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: 'bold',
    },
    modalSubtitle: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalScroll: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    modalTakeawayBanner: {
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: 16,
      padding: 14,
      marginBottom: 16,
    },
    modalTakeawayHeader: {
      color: colors.primaryText,
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    modalTakeawayBody: {
      color: colors.textPrimary,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '500',
    },
    modalPitchBanner: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(13, 148, 136, 0.3)',
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
      color: colors.accentText,
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    pitchSubheader: {
      color: colors.textMuted,
      fontSize: 11,
      marginBottom: 6,
    },
    pitchBody: {
      color: colors.textPrimary,
      fontSize: 13,
      lineHeight: 19,
      fontStyle: 'italic',
      fontWeight: '500',
    },
    modalDiagramContainer: {
      backgroundColor: colors.surfaceSubtle,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.primaryText,
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    diagramScroll: {
      marginTop: 4,
    },
    diagramMonospace: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: colors.accentTealText,
      fontSize: 11,
      lineHeight: 16,
    },
    modalPitfallsContainer: {
      backgroundColor: colors.dangerSoft,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(248, 113, 113, 0.3)' : 'rgba(220, 38, 38, 0.25)',
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
      color: colors.dangerText,
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
      color: colors.danger,
      fontSize: 13,
      fontWeight: 'bold',
      lineHeight: 18,
    },
    pitfallText: {
      color: colors.dangerText,
      fontSize: 12,
      lineHeight: 17,
      flex: 1,
    },
    bulletSectionTitle: {
      color: colors.textPrimary,
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
      color: colors.primary,
      fontSize: 14,
      lineHeight: 18,
    },
    bulletText: {
      color: colors.textSecondary,
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
      backgroundColor: colors.primary,
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalQuizButtonText: {
      color: colors.textInverse,
      fontSize: 13,
      fontWeight: 'bold',
    },
    modalDismissButton: {
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalDismissText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },

    // Synchronized Captions & Subtitles
    captionOverlayContainer: {
      position: 'absolute',
      bottom: 235,
      left: 16,
      right: 64,
      alignItems: 'center',
      zIndex: 26,
    },
    desktopCaptionOverlayContainer: {
      position: 'absolute',
      bottom: 100,
      left: 14,
      right: 70,
      alignItems: 'center',
      zIndex: 26,
    },
    captionPill: {
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: '100%',
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    captionText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 16,
    },

    // Hidden Stream Preloader for Instant 0ms Swipe
    preloaderHidden: {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0,
      overflow: 'hidden',
    },
    preloaderVideo: {
      width: 1,
      height: 1,
    },
  });
}
