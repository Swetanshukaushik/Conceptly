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
    const isPM = lower.includes('circle') || lower.includes('product') || lower.includes('metric') || lower.includes('pm');
    const isFin = lower.includes('dcf') || lower.includes('valuation') || lower.includes('wacc') || lower.includes('profit');
    const isUpsc = lower.includes('basic') || lower.includes('structure') || lower.includes('polity') || lower.includes('article') || lower.includes('constitution');
    const isJee = lower.includes('inertia') || lower.includes('rotat') || lower.includes('axis') || lower.includes('torque');
    const isNeet = lower.includes('cardiac') || lower.includes('ecg') || lower.includes('heart') || lower.includes('circulation');

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

    if (isPM) {
      return {
        systemName: 'PRODUCT FUNNEL & CIRCLES SIMULATOR',
        faultButtonLabel: '⚡ Inject Onboarding Friction',
        mitigateButtonLabel: '🛡️ Prioritize Core Persona MVP',
        nodes: [
          {
            id: 'N1',
            role: 'ACQUISITION',
            name: 'Target Persona',
            status: simMode === 'nominal' ? 'SEGMENTED' : simMode === 'fault' ? 'UNFOCUSED' : 'ICP LOCKED',
            latency: simMode === 'nominal' ? 'CTR 4.8%' : simMode === 'fault' ? 'CTR 0.9%' : 'CTR 6.2%',
          },
          {
            id: 'N2',
            role: 'ACTIVATION',
            name: 'Aha! Workflow',
            status: simMode === 'nominal' ? 'TTV 45s' : simMode === 'fault' ? 'DROP-OFF 78%' : '1-CLICK FLOW',
            latency: simMode === 'nominal' ? 'CVR 64%' : simMode === 'fault' ? 'CVR 14%' : 'CVR 79%',
          },
          {
            id: 'N3',
            role: 'NORTH STAR',
            name: 'D30 Retention',
            status: simMode === 'nominal' ? 'COHORT +42%' : simMode === 'fault' ? 'CHURN SPIKE' : 'COMPOUNDING',
            latency: simMode === 'nominal' ? 'NDR 118%' : simMode === 'fault' ? 'NDR 74%' : 'NDR 132%',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: CIRCLES framework aligns user pain point directly with measurable North Star retention.'
            : simMode === 'fault'
            ? 'FEATURE CREEP FAULT: Building unprioritized edge features before validating user need collapses D30 retention.'
            : 'MITIGATED: Ruthless RICE prioritization cuts friction and accelerates Time-To-Value (TTV).',
      };
    }

    if (isFin) {
      return {
        systemName: 'DCF VALUATION & WACC SENSITIVITY',
        faultButtonLabel: '⚡ Hike WACC (+300 bps)',
        mitigateButtonLabel: '🛡️ Optimize NWC & FCF Margin',
        nodes: [
          {
            id: 'N1',
            role: 'OPERATING ENGINE',
            name: 'Unlevered FCF',
            status: simMode === 'nominal' ? 'EBIT(1-T)+DA' : simMode === 'fault' ? 'CAPEX DRAG' : 'NWC RELEASE',
            latency: simMode === 'nominal' ? '$140M/yr' : simMode === 'fault' ? '$92M/yr' : '$168M/yr',
          },
          {
            id: 'N2',
            role: 'DISCOUNT RATE',
            name: 'WACC Hurdle',
            status: simMode === 'nominal' ? 'WACC 8.5%' : simMode === 'fault' ? 'WACC 11.5%' : 'HEDGED 8.2%',
            latency: simMode === 'nominal' ? 'Ke 10.2%' : simMode === 'fault' ? 'Ke 14.0%' : 'Kd Optimized',
          },
          {
            id: 'N3',
            role: 'VALUATION OUTPUT',
            name: 'Enterprise Value',
            status: simMode === 'nominal' ? 'EV $2.4B' : simMode === 'fault' ? 'EV $1.5B (-37%)' : 'EV $2.8B',
            latency: simMode === 'nominal' ? 'TV 68% EV' : simMode === 'fault' ? 'COMPRESSED' : 'ACCRETIVE',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: Unlevered Free Cash Flows discounted at 8.5% WACC with 2.5% perpetual terminal growth.'
            : simMode === 'fault'
            ? 'RATE SHOCK: A +300 bps jump in WACC disproportionately crushes Terminal Value (PV of TV drops 37%).'
            : 'MITIGATED: Expanding operating margin and tightening Working Capital offsets discount rate compression.',
      };
    }

    if (isUpsc) {
      return {
        systemName: 'CONSTITUTIONAL JUDICIAL REVIEW MATRIX',
        faultButtonLabel: '⚡ Pass Ultra-Vires Amendment',
        mitigateButtonLabel: '🛡️ Invoke Basic Structure (Art 368)',
        nodes: [
          {
            id: 'N1',
            role: 'LEGISLATURE',
            name: 'Parliament Art 368',
            status: simMode === 'nominal' ? '2/3 MAJORITY' : simMode === 'fault' ? 'CURTAIL ART 32' : 'BOUNDED POWER',
            latency: simMode === 'nominal' ? 'VALID BILL' : simMode === 'fault' ? 'OVERREACH' : 'CONSTITUTIONAL',
          },
          {
            id: 'N2',
            role: 'JUDICIARY',
            name: 'SC Constitution Bench',
            status: simMode === 'nominal' ? 'ART 13 REVIEW' : simMode === 'fault' ? 'CHALLENGED' : '7:6 DOCTRINE',
            latency: simMode === 'nominal' ? 'HARMONIOUS' : simMode === 'fault' ? 'WRIT FILED' : 'STRUCK DOWN',
          },
          {
            id: 'N3',
            role: 'CORE PILLAR',
            name: 'Basic Structure',
            status: simMode === 'nominal' ? 'PROTECTED' : simMode === 'fault' ? 'VIOLATED' : 'INVIOLABLE',
            latency: simMode === 'nominal' ? 'RULE OF LAW' : simMode === 'fault' ? 'NULL & VOID' : 'KESAVANANDA',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: Parliament amends the Constitution within the permissible bounds of Article 368.'
            : simMode === 'fault'
            ? 'CONSTITUTIONAL CRISIS: Amendment attempts to abrogate Judicial Review or Secular/Federal character.'
            : 'MITIGATED: Supreme Court applies Kesavananda Bharati (1973) Basic Structure Doctrine to strike down the ultra-vires clause.',
      };
    }

    if (isJee) {
      return {
        systemName: 'RIGID BODY ROTATIONAL DYNAMICS LAB',
        faultButtonLabel: '⚡ Apply 2D Theorem to 3D Sphere',
        mitigateButtonLabel: '🛡️ Enforce Parallel Axis (Icm + Md²)',
        nodes: [
          {
            id: 'N1',
            role: 'COM INERTIA',
            name: 'Center of Mass (I_cm)',
            status: simMode === 'nominal' ? '2/5 M·R²' : simMode === 'fault' ? '3D GEOMETRY' : '2/5 M·R²',
            latency: simMode === 'nominal' ? 'AXIS: COM' : simMode === 'fault' ? 'NON-PLANAR' : 'VALID COM',
          },
          {
            id: 'N2',
            role: 'AXIS SHIFT',
            name: 'Tangent Offset (d = R)',
            status: simMode === 'nominal' ? '+ M·d²' : simMode === 'fault' ? 'Iz ≠ Ix + Iy' : '+ M·R² APPLIED',
            latency: simMode === 'nominal' ? 'PARALLEL OK' : simMode === 'fault' ? 'TRAP ERROR' : 'EXACT SHIFT',
          },
          {
            id: 'N3',
            role: 'TOTAL INERTIA',
            name: 'I_tangent Output',
            status: simMode === 'nominal' ? '7/5 M·R²' : simMode === 'fault' ? 'INVALID' : '7/5 M·R² VERIFIED',
            latency: simMode === 'nominal' ? '1.40 MR²' : simMode === 'fault' ? 'ERRONEOUS' : '1.40 MR²',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: Parallel Axis Theorem (I = I_cm + Md²) accurately computes inertia about any displaced parallel axis.'
            : simMode === 'fault'
            ? 'JEE EXAM TRAP: Perpendicular Axis Theorem (Iz = Ix + Iy) ONLY works for 2D planar laminas, never 3D spheres!'
            : 'MITIGATED: Using 3D symmetry + Parallel Axis Theorem yields exact I_tangent = 2/5 MR² + MR² = 7/5 MR².',
      };
    }

    if (isNeet) {
      return {
        systemName: 'CARDIAC CONDUCTION & ECG WAVE SIMULATOR',
        faultButtonLabel: '⚡ Induce AV Nodal Delay',
        mitigateButtonLabel: '🛡️ Synchronize SA → Purkinje',
        nodes: [
          {
            id: 'N1',
            role: 'PACEMAKER (0.1s)',
            name: 'SA Node → Atria',
            status: simMode === 'nominal' ? 'P-WAVE DEPOL' : simMode === 'fault' ? 'P-WAVE OK' : '72 BPM SYNC',
            latency: simMode === 'nominal' ? '0.10s SYSTOLE' : simMode === 'fault' ? 'PR PROLONGED' : '0.10s ATRIAL',
          },
          {
            id: 'N2',
            role: 'VENTRICLES (0.3s)',
            name: 'AV → Bundle of His',
            status: simMode === 'nominal' ? 'QRS COMPLEX' : simMode === 'fault' ? 'AV BLOCK' : 'LUB (S1) CLOSED',
            latency: simMode === 'nominal' ? '0.30s EJECTION' : simMode === 'fault' ? 'DROPPED BEAT' : 'SV = 70 mL',
          },
          {
            id: 'N3',
            role: 'DIASTOLE (0.4s)',
            name: 'Repolarization',
            status: simMode === 'nominal' ? 'T-WAVE + DUB' : simMode === 'fault' ? 'LOW CO' : 'CO = 5.04 L/min',
            latency: simMode === 'nominal' ? '0.80s CYCLE' : simMode === 'fault' ? 'ARRHYTHMIA' : 'DUB (S2) SEALED',
          },
        ],
        diagnostic:
          simMode === 'nominal'
            ? 'NOMINAL: 0.8s Cardiac Cycle (0.1s Atrial Systole + 0.3s Ventricular Systole + 0.4s Joint Diastole) = 5L/min CO.'
            : simMode === 'fault'
            ? 'CONDUCTION FAULT: Impaired AV node conduction delays QRS ventricular depolarization and reduces stroke volume.'
            : 'MITIGATED: Coordinated SA → AV → Purkinje firing restores sharp QRS complex and 70 mL Stroke Volume.',
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
