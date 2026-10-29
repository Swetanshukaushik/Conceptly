import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from './Icon';
import { BionicToggle } from './BionicText';

export function CognitiveTelemetryBar() {
  const { colors } = useTheme();
  const watchedReels = useAppStore((s) => s.watchedReels);
  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const bionicReading = useAppStore((s) => s.bionicReading);
  const flashcardSRS = useAppStore((s) => s.flashcardSRS);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);

  const metrics = useMemo(() => {
    const watchedCount = Object.values(watchedReels).filter(Boolean).length;
    const srsEntries = Object.values(flashcardSRS);
    const avgBox =
      srsEntries.length > 0
        ? srsEntries.reduce((acc, r) => acc + r.box, 0) / srsEntries.length
        : 3.4;
    const synapticRetention = Math.min(99.4, 82.0 + watchedCount * 2.1 + avgBox * 1.8).toFixed(1);
    const effectiveVelocity = (playbackSpeed * (bionicReading ? 1.6 : 1.0)).toFixed(2);
    const dueCount = srsEntries.filter((r) => r.nextReviewAt <= Date.now()).length;

    return {
      synapticRetention,
      effectiveVelocity,
      watchedCount,
      dueCount,
    };
  }, [watchedReels, playbackSpeed, bionicReading, flashcardSRS]);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderTopColor: colors.borderSpecular,
        },
      ]}
    >
      <View style={styles.telemetryGroup}>
        {/* Live Pulse Indicator */}
        <View style={styles.statusChip}>
          <View style={[styles.pulseDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.monoLabel, { color: colors.textMuted }]}>NEURAL HUD</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Synaptic Stability */}
        <View style={styles.metricItem}>
          <Text style={[styles.metricKey, { color: colors.textMuted }]}>SYNAPTIC</Text>
          <Text style={[styles.metricVal, { color: colors.telemetryMono }]}>
            {metrics.synapticRetention}%
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Cognitive Velocity */}
        <View style={styles.metricItem}>
          <Text style={[styles.metricKey, { color: colors.textMuted }]}>VELOCITY</Text>
          <Text style={[styles.metricVal, { color: colors.accentTealText }]}>
            {metrics.effectiveVelocity}x
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Checkpoints */}
        <View style={styles.metricItem}>
          <Text style={[styles.metricKey, { color: colors.textMuted }]}>NODES</Text>
          <Text style={[styles.metricVal, { color: colors.textPrimary }]}>
            {metrics.watchedCount} SYNCED
          </Text>
        </View>
      </View>

      <View style={styles.actionsGroup}>
        <BionicToggle compact={Platform.OS !== 'web'} />

        <Pressable
          onPress={() => setCommandPaletteOpen(true)}
          style={[
            styles.omnibarTrigger,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
            },
          ]}
        >
          <Icon name="search" size={12} color={colors.primaryText} />
          <Text style={[styles.omnibarText, { color: colors.textPrimary }]}>Omnibar</Text>
          <View
            style={[
              styles.kbdBadge,
              {
                backgroundColor: colors.primarySoft,
                borderColor: colors.primaryBorder,
              },
            ]}
          >
            <Text style={[styles.kbdText, { color: colors.primaryText }]}>⌘K</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  telemetryGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  monoLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    width: 1,
    height: 14,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricKey: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  metricVal: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '800',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  omnibarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  omnibarText: {
    fontSize: 11,
    fontWeight: '700',
  },
  kbdBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    borderWidth: 1,
  },
  kbdText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
  },
});
