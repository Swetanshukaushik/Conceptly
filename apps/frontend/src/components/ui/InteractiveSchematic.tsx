import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from './Icon';

export interface InteractiveSchematicProps {
  title: string;
  topicId?: string;
  asciiDiagram?: string;
}

type SimMode = 'nominal' | 'fault' | 'mitigated';

export function InteractiveSchematic({
  title,
  topicId = '',
  asciiDiagram,
}: InteractiveSchematicProps) {
  const { colors } = useTheme();
  const [simMode, setSimMode] = useState<SimMode>('nominal');
  const [showAscii, setShowAscii] = useState<boolean>(false);

  const topology = useMemo(() => {
    const lower = `${topicId} ${title}`.toLowerCase();
    const isCap = lower.includes('cap') || lower.includes('pacelc') || lower.includes('consensus');
    const isCache = lower.includes('cache') || lower.includes('stampede') || lower.includes('redis');

    if (isCap) {
      return {
        systemName: 'DISTRIBUTED CONSENSUS TOPOLOGY',
        faultButtonLabel: '⚡ Sever Quorum Link',
        mitigateButtonLabel: '🛡️ Enforce CP / Tunable Quorum',
        nodes: [
          {
            id: 'N1',
            role: 'CLIENT INGRESS',
            name: 'Write(x = 42)',
            status: simMode === 'nominal' ? 'ACK 200' : simMode === 'fault' ? 'SPLIT' : 'QUORUM W=2',
            latency: simMode === 'nominal' ? '1.4ms' : simMode === 'fault' ? 'ERR' : '2.1ms',
          },
          {
            id: 'N2',
            role: 'LEADER NODE',
            name: 'Primary Shard A',
            status: simMode === 'nominal' ? 'SYNCED' : simMode === 'fault' ? 'ISOLATED' : 'RAFT LEADER',
            latency: simMode === 'nominal' ? '0.8ms' : simMode === 'fault' ? 'PARTITION' : '1.1ms',
          },
          {
            id: 'N3',
            role: 'FOLLOWER NODE',
            name: 'Replica Shard B',
            status: simMode === 'nominal' ? 'v42 OK' : simMode === 'fault' ? 'STALE v41' : 'FENCED / SAFE',
            latency: simMode === 'nominal' ? '1.9ms' : simMode === 'fault' ? '∞ DRIFT' : 'LOCKED',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: Replication link healthy. Linearizable reads & writes active across all nodes.'
            : simMode === 'fault'
            ? 'NETWORK PARTITION DETECTED: Unmitigated AP serves stale v41 on Node B; unmitigated CP drops availability.'
            : 'MITIGATED: Epoch fencing & tunable quorum (R + W > N) prevents split-brain stale reads.',
      };
    }

    if (isCache) {
      return {
        systemName: 'HIGH-CONCURRENCY CACHE TOPOLOGY',
        faultButtonLabel: '🔥 Trigger Key Expiration',
        mitigateButtonLabel: '🛡️ Enable XFetch + Mutex',
        nodes: [
          {
            id: 'N1',
            role: 'TRAFFIC BURST',
            name: '10,000 RPS Ingress',
            status: simMode === 'nominal' ? 'HIT 99.8%' : simMode === 'fault' ? '10K MISS' : 'COALESCED',
            latency: simMode === 'nominal' ? '0.4ms' : simMode === 'fault' ? '840ms' : '0.6ms',
          },
          {
            id: 'N2',
            role: 'MEMORY TIER',
            name: 'Redis Cluster',
            status: simMode === 'nominal' ? 'TTL 45s' : simMode === 'fault' ? 'KEY EXPIRED' : 'XFETCH EARLY',
            latency: simMode === 'nominal' ? '0.9ms' : simMode === 'fault' ? 'BYPASSED' : '1.2ms',
          },
          {
            id: 'N3',
            role: 'STORAGE ENGINE',
            name: 'Primary Postgres',
            status: simMode === 'nominal' ? 'IDLE 4% CPU' : simMode === 'fault' ? '100% OOM' : '1 WORKER QUERY',
            latency: simMode === 'nominal' ? '12ms' : simMode === 'fault' ? '503 CRASH' : '14ms',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: Hot key served directly from L1/Redis memory tier in sub-millisecond time.'
            : simMode === 'fault'
            ? 'STAMPEDE ALERT: Simultaneous key expiry caused 10,000 threads to hammer Primary DB concurrently!'
            : 'MITIGATED: Probabilistic early refresh (XFetch) + singleflight mutex recomputes key with 1 thread.',
      };
    }

    return {
      systemName: 'INTERACTIVE CONCEPT TOPOLOGY',
      faultButtonLabel: '⚡ Inject Edge-Case Load',
      mitigateButtonLabel: '🛡️ Apply Optimal Invariant',
      nodes: [
        {
          id: 'N1',
          role: 'INPUT VECTOR',
          name: 'Boundary State',
          status: simMode === 'nominal' ? 'VALIDATED' : simMode === 'fault' ? 'SKEWED' : 'BOUNDED',
          latency: simMode === 'nominal' ? 'O(1)' : simMode === 'fault' ? 'O(N²)' : 'O(log N)',
        },
        {
          id: 'N2',
          role: 'CORE INVARIANT',
          name: title.slice(0, 18),
          status: simMode === 'nominal' ? 'NOMINAL' : simMode === 'fault' ? 'BOTTLENECK' : 'OPTIMIZED',
          latency: simMode === 'nominal' ? '1.2ms' : simMode === 'fault' ? '490ms' : '0.9ms',
        },
        {
          id: 'N3',
          role: 'OUTPUT PROOF',
          name: 'Verified Target',
          status: simMode === 'nominal' ? 'EXACT' : simMode === 'fault' ? 'DEGRADED' : 'GUARANTEED',
          latency: simMode === 'nominal' ? '99.9%' : simMode === 'fault' ? '61.0%' : '99.99%',
        },
      ],
      diagnostic:
        simMode === 'nominal'
          ? `NOMINAL: Standard execution path for ${title} operating within expected bounds.`
          : simMode === 'fault'
          ? `STRESS FAULT: Adversarial input or scale spike exposes worst-case degradation if invariants are ignored.`
          : `MITIGATED: Applying core mental model invariant restores optimal complexity and fault tolerance.`,
    };
  }, [topicId, title, simMode]);

  const modeColor =
    simMode === 'nominal'
      ? colors.success
      : simMode === 'fault'
      ? colors.danger
      : colors.primary;

  const modeSoft =
    simMode === 'nominal'
      ? colors.successSoft
      : simMode === 'fault'
      ? colors.dangerSoft
      : colors.primarySoft;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderTopColor: colors.borderSpecular,
        },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Icon name="git-network" size={14} color={modeColor} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {topology.systemName}
          </Text>
        </View>

        {asciiDiagram && (
          <Pressable
            onPress={() => setShowAscii((prev) => !prev)}
            style={[
              styles.modeSwitchBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.modeSwitchText, { color: colors.primaryText }]}>
              {showAscii ? '⚡ Live Simulator' : '📐 Raw ASCII'}
            </Text>
          </Pressable>
        )}
      </View>

      {showAscii && asciiDiagram ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
          <Text
            style={[
              styles.asciiText,
              { color: colors.accentTealText },
            ]}
          >
            {asciiDiagram.trim()}
          </Text>
        </ScrollView>
      ) : (
        <>
          {/* Interactive Simulation State Controls */}
          <View style={styles.simButtonsRow}>
            <Pressable
              onPress={() => setSimMode('nominal')}
              style={[
                styles.simBtn,
                {
                  backgroundColor: simMode === 'nominal' ? colors.successSoft : colors.surface,
                  borderColor: simMode === 'nominal' ? colors.success : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  { color: simMode === 'nominal' ? colors.successText : colors.textSecondary },
                ]}
              >
                ● Nominal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSimMode('fault')}
              style={[
                styles.simBtn,
                {
                  backgroundColor: simMode === 'fault' ? colors.dangerSoft : colors.surface,
                  borderColor: simMode === 'fault' ? colors.danger : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  { color: simMode === 'fault' ? colors.dangerText : colors.textSecondary },
                ]}
              >
                {topology.faultButtonLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSimMode('mitigated')}
              style={[
                styles.simBtn,
                {
                  backgroundColor: simMode === 'mitigated' ? colors.primarySoft : colors.surface,
                  borderColor: simMode === 'mitigated' ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  { color: simMode === 'mitigated' ? colors.primaryText : colors.textSecondary },
                ]}
              >
                {topology.mitigateButtonLabel}
              </Text>
            </Pressable>
          </View>

          {/* 3-Node Live Schematic Graph */}
          <View style={styles.nodesRow}>
            {topology.nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <View
                  style={[
                    styles.nodeBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: modeColor,
                    },
                  ]}
                >
                  <Text style={[styles.nodeRole, { color: colors.textMuted }]} numberOfLines={1}>
                    {node.role}
                  </Text>
                  <Text style={[styles.nodeName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {node.name}
                  </Text>
                  <View
                    style={[
                      styles.nodeStatusBadge,
                      { backgroundColor: modeSoft, borderColor: modeColor },
                    ]}
                  >
                    <Text style={[styles.nodeStatusText, { color: modeColor }]} numberOfLines={1}>
                      {node.status}
                    </Text>
                  </View>
                  <Text style={[styles.nodeLatency, { color: colors.telemetryMono }]}>
                    {node.latency}
                  </Text>
                </View>

                {i < topology.nodes.length - 1 && (
                  <View style={styles.edgeConnector}>
                    <Text style={[styles.edgeArrow, { color: modeColor }]}>
                      {simMode === 'fault' ? '─✕─►' : '───►'}
                    </Text>
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Diagnostic Readout */}
          <View
            style={[
              styles.diagnosticBanner,
              {
                backgroundColor: modeSoft,
                borderColor: modeColor,
              },
            ]}
          >
            <Text style={[styles.diagnosticText, { color: colors.textPrimary }]}>
              {topology.diagnostic}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  modeSwitchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeSwitchText: {
    fontSize: 10,
    fontWeight: '700',
  },
  simButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  simBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  simBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nodeBox: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  nodeRole: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  nodeName: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 5,
  },
  nodeStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  nodeStatusText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
  },
  nodeLatency: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
  edgeConnector: {
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  edgeArrow: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  diagnosticBanner: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  diagnosticText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  asciiText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
});
