import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { mockTopicDetails } from '@/services/api/mockData';
import type { TopicDto } from '@/services/api/types';
import { Icon } from './Icon';
import { BionicText } from './BionicText';

export interface ConstellationGraphProps {
  topics: TopicDto[];
  chapterTitle?: string;
  subjectName?: string;
}

export function ConstellationGraph({
  topics,
  chapterTitle = 'Core Module',
  subjectName = 'Domain Track',
}: ConstellationGraphProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const userProgress = useAppStore((s) => s.userProgress);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id ?? '');

  useEffect(() => {
    if (topics.length > 0 && !topics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  const enrichedNodes = useMemo(() => {
    return topics.map((t, idx) => {
      const detail = mockTopicDetails.find((d) => d.id === t.id);
      const prog = userProgress.find((p) => p.topicId === t.id);
      const completion = prog?.completionPercent ?? (idx === 0 ? 100 : idx === 1 ? 65 : 0);
      const state: 'mastered' | 'active' | 'frontier' =
        completion >= 100 ? 'mastered' : completion > 0 || idx === 0 ? 'active' : 'frontier';

      return {
        ...t,
        index: idx,
        coordinate: `VEC-0${idx + 1}.40`,
        completion,
        state,
        mentalModel:
          (t as any).cheatSheetSummary?.[0] ??
          detail?.cheatSheetSummary?.[0] ??
          `Master core invariants, architectural trade-offs, and high-yield applications of ${t.title}.`,
      };
    });
  }, [topics, userProgress]);

  const activeNode =
    enrichedNodes.find((n) => n.id === selectedTopicId) ?? enrichedNodes[0];

  if (!enrichedNodes.length) return null;

  return (
    <View
      style={[
        styles.constellationWrapper,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderTopColor: colors.borderSpecular,
        },
      ]}
    >
      {/* Top Constellation HUD Bar */}
      <View style={[styles.hudHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.hudTitleRow}>
          <Icon name="git-network" size={16} color={colors.telemetryMono} />
          <Text style={[styles.hudTitle, { color: colors.textPrimary }]}>
            NEURAL SKILL CONSTELLATION
          </Text>
        </View>
        <Text style={[styles.hudMeta, { color: colors.telemetryMono }]}>
          {enrichedNodes.length} NODES • {Math.max(0, enrichedNodes.length - 1)} VECTORS
        </Text>
      </View>

      {/* Orbital Node Chain */}
      <View style={styles.graphCanvas}>
        {enrichedNodes.map((node, i) => {
          const isSelected = node.id === activeNode?.id;
          const statusColor =
            node.state === 'mastered'
              ? colors.success
              : node.state === 'active'
              ? colors.primary
              : colors.accent;

          const statusBg =
            node.state === 'mastered'
              ? colors.successSoft
              : node.state === 'active'
              ? colors.primarySoft
              : colors.accentSoft;

          const alignment = i % 2 === 0 ? 'flex-start' : 'flex-end';

          return (
            <View key={node.id} style={styles.nodeStepContainer}>
              <View style={[styles.nodeRowWrapper, { justifyContent: alignment }]}>
                <Pressable
                  onPress={() => setSelectedTopicId(node.id)}
                  style={[
                    styles.orbitalNode,
                    {
                      backgroundColor: isSelected ? statusBg : colors.surfaceSubtle,
                      borderColor: isSelected ? statusColor : colors.border,
                      borderTopColor: isSelected ? statusColor : colors.borderSpecular,
                      shadowColor: statusColor,
                      shadowOpacity: isSelected ? 0.35 : 0.08,
                    },
                  ]}
                >
                  {/* Node Top Telemetry */}
                  <View style={styles.nodeTopBar}>
                    <View style={styles.coordChip}>
                      <View style={[styles.orbDot, { backgroundColor: statusColor }]} />
                      <Text style={[styles.coordText, { color: colors.telemetryMono }]}>
                        {node.coordinate}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.stateBadge,
                        { backgroundColor: statusBg, borderColor: statusColor },
                      ]}
                    >
                      <Text style={[styles.stateBadgeText, { color: statusColor }]}>
                        {node.state === 'mastered'
                          ? 'SYNAPSE LOCKED'
                          : node.state === 'active'
                          ? 'ACTIVE ORBIT'
                          : 'FRONTIER NODE'}
                      </Text>
                    </View>
                  </View>

                  {/* Node Title */}
                  <Text style={[styles.nodeTitle, { color: colors.textPrimary }]}>
                    {node.title}
                  </Text>

                  {/* Node Bottom Footer */}
                  <View style={styles.nodeBottomBar}>
                    <Text style={[styles.nodeMetaText, { color: colors.textMuted }]}>
                      {node.reelCount} Visual Reels • {node.difficulty.toUpperCase()}
                    </Text>
                    <Pressable
                      onPress={() => router.push(`/topic/${node.id}`)}
                      style={[
                        styles.quickEnterPill,
                        { backgroundColor: statusColor },
                      ]}
                    >
                      <Text style={[styles.quickEnterText, { color: colors.textInverse }]}>
                        Enter Node →
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </View>

              {/* Directed Prerequisite Vector Connector */}
              {i < enrichedNodes.length - 1 && (
                <View style={styles.vectorConnectorRow}>
                  <View style={[styles.vectorLine, { backgroundColor: statusColor }]} />
                  <View
                    style={[
                      styles.vectorPill,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.vectorLabel, { color: colors.telemetryMono }]}>
                      ▼ PREREQ VECTOR 0{i + 1}→0{i + 2}
                    </Text>
                  </View>
                  <View style={[styles.vectorLine, { backgroundColor: colors.border }]} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Tactical Node Inspector HUD */}
      {activeNode && (
        <View
          style={[
            styles.inspectorHud,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.primaryBorder,
              borderTopColor: colors.borderSpecular,
            },
          ]}
        >
          <View style={styles.inspectorTop}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.inspectorLabel, { color: colors.telemetryMono }]}>
                TACTICAL NODE INSPECTOR // {activeNode.coordinate}
              </Text>
              <Text style={[styles.inspectorTitle, { color: colors.textPrimary }]}>
                {activeNode.title}
              </Text>
            </View>
            <View
              style={[
                styles.synapsePill,
                { backgroundColor: colors.primarySoft, borderColor: colors.primaryBorder },
              ]}
            >
              <Text style={[styles.synapseText, { color: colors.primaryText }]}>
                {activeNode.completion}% SYNC
              </Text>
            </View>
          </View>

          <BionicText
            text={activeNode.mentalModel}
            style={{ fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 12 }}
          />

          <View style={styles.inspectorActions}>
            <Pressable
              onPress={() => router.push(`/topic/${activeNode.id}`)}
              style={[styles.primaryTeleportBtn, { backgroundColor: colors.primary }]}
            >
              <Icon name="play" size={14} color={colors.textInverse} />
              <Text style={[styles.primaryTeleportText, { color: colors.textInverse }]}>
                Launch Visual Reels ({activeNode.reelCount})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/quiz/${activeNode.id}`)}
              style={[
                styles.secondaryQuizBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="help-circle-outline" size={15} color={colors.primaryText} />
              <Text style={[styles.secondaryQuizText, { color: colors.textPrimary }]}>
                Quiz Checkpoint
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  constellationWrapper: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  hudTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hudTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  hudMeta: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  graphCanvas: {
    paddingVertical: 4,
  },
  nodeStepContainer: {
    width: '100%',
  },
  nodeRowWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  orbitalNode: {
    width: '88%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  nodeTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  coordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  coordText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  stateBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  nodeTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  nodeBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeMetaText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '600',
  },
  quickEnterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickEnterText: {
    fontSize: 11,
    fontWeight: '800',
  },
  vectorConnectorRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  vectorLine: {
    width: 2,
    height: 10,
  },
  vectorPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  vectorLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  inspectorHud: {
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  inspectorTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inspectorLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  inspectorTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  synapsePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  synapseText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  inspectorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryTeleportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryTeleportText: {
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryQuizText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
