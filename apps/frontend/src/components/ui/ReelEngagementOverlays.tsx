import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from './Icon';
import { BionicText } from './BionicText';
import type { ReelDto } from '@/services/api/types';

// -----------------------------------------------------------------------------
// 1. Interactive Timeline Scrubber with 0s / 15s / 30s Phase Jump Markers
// -----------------------------------------------------------------------------
export function ReelTimelineScrubber({
  currentSec,
  durationSec = 45,
  onSeek,
  compact = false,
}: {
  currentSec: number;
  durationSec?: number;
  onSeek: (targetSec: number) => void;
  compact?: boolean;
}) {
  const { colors, isDark } = useTheme();
  const total = Math.max(15, durationSec || 45);
  const progressPct = Math.min(100, Math.max(0, (currentSec / total) * 100));

  const phases = useMemo(
    () => [
      { label: '🎯 Model', sec: 0 },
      { label: '⚡ Arch', sec: Math.round(total * 0.33) },
      { label: '🎤 Pitch', sec: Math.round(total * 0.66) },
    ],
    [total]
  );

  return (
    <View style={[styles.scrubberWrapper, compact && { marginBottom: 6 }]}>
      {/* Phase Jump Pills + +/-5s Tactile Seek Controls (Hidden in compact mode) */}
      {!compact && (
        <View style={styles.phaseRow}>
          <View style={styles.phasePillsGroup}>
            {phases.map((p, idx) => {
              const nextSec = phases[idx + 1]?.sec ?? total + 1;
              const isActive = currentSec >= p.sec && currentSec < nextSec;
              return (
                <Pressable
                  key={p.label}
                  onPress={() => onSeek(p.sec)}
                  style={[
                    styles.phasePill,
                    {
                      backgroundColor: isActive
                        ? colors.primarySoft
                        : isDark
                        ? 'rgba(15, 23, 42, 0.75)'
                        : 'rgba(255, 255, 255, 0.85)',
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.phasePillText,
                      { color: isActive ? colors.primaryText : colors.textSecondary },
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.seekNudgeGroup}>
            <Pressable
              onPress={() => onSeek(Math.max(0, currentSec - 5))}
              style={[
                styles.nudgeBtn,
                {
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.nudgeBtnText, { color: colors.textPrimary }]}>-5s</Text>
            </Pressable>
            <Pressable
              onPress={() => onSeek(Math.min(total - 1, currentSec + 5))}
              style={[
                styles.nudgeBtn,
                {
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.nudgeBtnText, { color: colors.textPrimary }]}>+5s</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Progress Bar Track */}
      <View
        style={[
          styles.trackBar,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.15)' },
        ]}
      >
        <View
          style={[
            styles.trackFill,
            {
              width: `${progressPct}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
        {/* Phase tick marks at 33% and 66% */}
        <View style={[styles.phaseTick, { left: '33%', backgroundColor: colors.borderSpecular }]} />
        <View style={[styles.phaseTick, { left: '66%', backgroundColor: colors.borderSpecular }]} />
      </View>
    </View>
  );
}

// -----------------------------------------------------------------------------
// 2. Active Recall Micro-Check Overlay (1-Tap Instant Concept Verification)
// -----------------------------------------------------------------------------
export function ReelMicroCheckOverlay({
  reel,
  visible,
  onClose,
  onCorrect,
}: {
  reel: ReelDto;
  visible: boolean;
  onClose: () => void;
  onCorrect?: () => void;
}) {
  const { colors, isDark } = useTheme();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIdx(null);
  }, [reel.id, visible]);

  if (!visible) return null;

  const correctStatement =
    reel.keyTakeaway ||
    reel.summaryNotes?.[0] ||
    `Apply structured trade-off analysis and invariant boundaries for ${reel.title}.`;

  const trapStatement =
    reel.pitfalls?.[0] ||
    `Ignore edge-case bottlenecks and assume infinite horizontal scalability without trade-offs.`;

  // Deterministic option order based on reel.id length so it alternates A/B
  const correctIsFirst = reel.id.length % 2 === 0;
  const options = correctIsFirst
    ? [
        { text: correctStatement, isCorrect: true },
        { text: trapStatement, isCorrect: false },
      ]
    : [
        { text: trapStatement, isCorrect: false },
        { text: correctStatement, isCorrect: true },
      ];

  const isAnswered = selectedIdx !== null;
  const isUserCorrect = isAnswered && options[selectedIdx].isCorrect;

  return (
    <View
      style={[
        styles.overlayCard,
        {
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: isAnswered
            ? isUserCorrect
              ? colors.success
              : colors.danger
            : colors.primary,
        },
      ]}
    >
      <View style={styles.overlayHeader}>
        <View style={styles.overlayBadgeRow}>
          <Icon name="flash" size={14} color={colors.primaryText} />
          <Text style={[styles.overlayHeaderTitle, { color: colors.primaryText }]}>
            ⚡ 10-SECOND SYNAPTIC MICRO-CHECK
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeMiniBtn}>
          <Icon name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Text style={[styles.microPrompt, { color: colors.textPrimary }]}>
        Which statement represents the true invariant for {reel.title}?
      </Text>

      <View style={{ gap: 8, marginTop: 8 }}>
        {options.map((opt, idx) => {
          const isChosen = selectedIdx === idx;
          let bg = colors.surfaceSubtle;
          let border = colors.border;
          let textColor = colors.textPrimary;

          if (isAnswered) {
            if (opt.isCorrect) {
              bg = colors.successSoft;
              border = colors.success;
              textColor = colors.successText;
            } else if (isChosen && !opt.isCorrect) {
              bg = colors.dangerSoft;
              border = colors.danger;
              textColor = colors.dangerText;
            }
          }

          return (
            <Pressable
              key={idx}
              onPress={() => {
                if (!isAnswered) {
                  setSelectedIdx(idx);
                  if (opt.isCorrect && onCorrect) {
                    onCorrect();
                  }
                }
              }}
              style={[
                styles.microOptionBtn,
                { backgroundColor: bg, borderColor: border },
              ]}
            >
              <View
                style={[
                  styles.microOptionBadge,
                  { backgroundColor: colors.surface, borderColor: border },
                ]}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', color: textColor }}>
                  {idx === 0 ? 'A' : 'B'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <BionicText
                  text={opt.text}
                  style={{ fontSize: 12, lineHeight: 17, color: textColor }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      {isAnswered && (
        <View style={styles.microFooterRow}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '800',
              color: isUserCorrect ? colors.successText : colors.warningText,
            }}
          >
            {isUserCorrect
              ? '🎉 +15 SYNAPTIC XP! Invariant Locked.'
              : '⚠️ Watch out for that common exam/interview trap!'}
          </Text>
          <Pressable
            onPress={onClose}
            style={[
              styles.continueMiniBtn,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textInverse }}>
              Continue →
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// -----------------------------------------------------------------------------
// 3. "Practice Your 30s Pitch" Live Teleprompter Mode
// -----------------------------------------------------------------------------
export function ReelPitchTeleprompter({
  reel,
  visible,
  onClose,
}: {
  reel: ReelDto;
  visible: boolean;
  onClose: () => void;
}) {
  const { colors, isDark } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(30);
    setIsRunning(true);
  }, [visible, reel.id]);

  useEffect(() => {
    if (!visible || !isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, isRunning]);

  if (!visible) return null;

  const pitchText =
    reel.interviewPitch ||
    reel.keyTakeaway ||
    `When designing or evaluating ${reel.title}, I first bound the core invariants, analyze worst-case failure modes, and apply the optimal trade-off pattern.`;

  const pctRemaining = (secondsLeft / 30) * 100;

  return (
    <View
      style={[
        styles.overlayCard,
        {
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          borderColor: colors.accentTeal,
        },
      ]}
    >
      <View style={styles.overlayHeader}>
        <View style={styles.overlayBadgeRow}>
          <Icon name="mic" size={14} color={colors.accentTealText} />
          <Text style={[styles.overlayHeaderTitle, { color: colors.accentTealText }]}>
            🎤 30s VERBATIM PITCH TELEPROMPTER
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeMiniBtn}>
          <Icon name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>
        Speak this aloud at a confident cadence before the 30s bar completes:
      </Text>

      <View
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 10,
        }}
      >
        <BionicText
          text={`"${pitchText}"`}
          style={{ fontSize: 14, lineHeight: 22, color: colors.textPrimary }}
        />
      </View>

      {/* Countdown Progress Bar */}
      <View
        style={{
          height: 5,
          borderRadius: 999,
          backgroundColor: colors.surfaceSubtle,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${pctRemaining}%`,
            backgroundColor: secondsLeft <= 5 ? colors.warning : colors.accentTeal,
          }}
        />
      </View>

      <View style={styles.microFooterRow}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: colors.telemetryMono }}>
          {secondsLeft > 0 ? `⏱️ 00:${String(secondsLeft).padStart(2, '0')}s REMAINING` : '✅ 30s PITCH COMPLETE!'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pressable
            onPress={() => {
              setSecondsLeft(30);
              setIsRunning(true);
            }}
            style={[
              styles.continueMiniBtn,
              { backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>
              Restart 30s
            </Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            style={[styles.continueMiniBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textInverse }}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// -----------------------------------------------------------------------------
// 4. Tactile Gesture & Turbo Hold Floating HUD Badge
// -----------------------------------------------------------------------------
export function ReelGestureBadge({
  message,
  isTurboHold,
}: {
  message: string | null;
  isTurboHold: boolean;
}) {
  const { colors, isDark } = useTheme();
  if (!message && !isTurboHold) return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.gestureBadge,
        {
          backgroundColor: isTurboHold
            ? colors.warningSoft
            : isDark
            ? 'rgba(11, 15, 25, 0.9)'
            : 'rgba(255, 255, 255, 0.94)',
          borderColor: isTurboHold ? colors.warning : colors.primary,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '800',
          color: isTurboHold ? colors.warningText : colors.primaryText,
          letterSpacing: 0.4,
        }}
      >
        {isTurboHold ? '⏩ 2.0x TURBO HOLD ACTIVE' : message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrubberWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 6,
  },
  phasePillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  phasePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  phasePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  seekNudgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nudgeBtn: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  nudgeBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  trackBar: {
    width: '100%',
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  trackFill: {
    height: '100%',
    borderRadius: 999,
  },
  phaseTick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
  },
  overlayCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 135,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    zIndex: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  overlayBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overlayHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  closeMiniBtn: {
    padding: 4,
  },
  microPrompt: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  microOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  microOptionBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  continueMiniBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  gestureBadge: {
    position: 'absolute',
    top: 106,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 50,
  },
});
