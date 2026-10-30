import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { mockTopicDetails, mockReels } from '@/services/api/mockData';
import type { TopicDto } from '@/services/api/types';
import { Icon } from './Icon';

export interface ConstellationGraphProps {
  topics: TopicDto[];
  chapterTitle?: string;
  subjectName?: string;
}

const STUDIO_MP4_TOPIC_IDS = new Set([
  'topic-moment-inertia',
  'topic-gauss-flux',
  'topic-total-internal-reflection',
  'topic-ohms-law',
]);

export function ConstellationGraph({
  topics,
  chapterTitle = 'Learning Path',
}: ConstellationGraphProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const userProgress = useAppStore((s) => s.userProgress);

  const nodes = useMemo(() => {
    return topics.map((t, idx) => {
      const detail = mockTopicDetails.find((d) => d.id === t.id);
      const prog = userProgress.find((p) => p.topicId === t.id);
      const completion = prog?.completionPercent ?? 0;
      const firstReel = mockReels.find((r) => r.topicId === t.id);
      const hasStudioMp4 =
        STUDIO_MP4_TOPIC_IDS.has(t.id) ||
        Boolean(firstReel?.videoUrl?.startsWith('/physics_reels/'));

      return {
        ...t,
        step: idx + 1,
        completion,
        firstReelId: firstReel?.id,
        hasStudioMp4,
        summary:
          detail?.cheatSheetSummary?.[0] ??
          `Core concepts and visual breakdown of ${t.title}.`,
      };
    });
  }, [topics, userProgress]);

  if (!nodes.length) return null;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.timelineList}>
        {nodes.map((node, i) => {
          const isDone = node.completion >= 100;
          const stepColor = isDone ? colors.success : colors.primary;

          return (
            <View key={node.id} style={styles.stepRow}>
              {/* Left Step Indicator + Vertical Line */}
              <View style={styles.railColumn}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: isDone ? colors.successSoft : colors.primarySoft,
                      borderColor: stepColor,
                    },
                  ]}
                >
                  <Text style={[styles.stepNumber, { color: stepColor }]}>
                    {node.step}
                  </Text>
                </View>
                {i < nodes.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
              </View>

              {/* Right Clean Card */}
              <Pressable
                onPress={() => router.push(`/topic/${node.id}`)}
                style={[
                  styles.nodeCard,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.cardTopRow}>
                  <Text style={[styles.nodeTitle, { color: colors.textPrimary }]}>
                    {node.title}
                  </Text>
                  {node.hasStudioMp4 && (
                    <View
                      style={[
                        styles.hdPill,
                        { backgroundColor: colors.accentSoft, borderColor: colors.accent },
                      ]}
                    >
                      <Text style={[styles.hdPillText, { color: colors.accent }]}>
                        HD Reel
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  numberOfLines={2}
                  style={[styles.nodeSummary, { color: colors.textSecondary }]}
                >
                  {node.summary}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    {node.difficulty} • {node.reelCount} reels
                  </Text>

                  <View style={styles.actionGroup}>
                    {node.firstReelId && (
                      <Pressable
                        onPress={() =>
                          router.push(`/reel/${node.firstReelId}?topicId=${node.id}`)
                        }
                        style={[
                          styles.watchBtn,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Icon name="play" size={11} color={colors.textInverse} />
                        <Text style={[styles.watchBtnText, { color: colors.textInverse }]}>
                          Watch
                        </Text>
                      </Pressable>
                    )}

                    <Pressable
                      onPress={() => router.push(`/topic/${node.id}`)}
                      style={[
                        styles.notesBtn,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.notesBtnText, { color: colors.textPrimary }]}>
                        Notes →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineList: {
    gap: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  railColumn: {
    alignItems: 'center',
    width: 28,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  nodeCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  nodeTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  hdPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  hdPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  nodeSummary: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  watchBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notesBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  notesBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
