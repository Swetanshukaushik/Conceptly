import React from 'react';
import { View, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Icon } from '@/components/ui/Icon';
import { ViewportToggle } from '@/components/ui/ViewportToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAppStore, DomainCategory } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

// Domain categories data for quick jump
const TARGET_TRACKS: Array<{
  id: DomainCategory;
  title: string;
  badge: string;
  iconName: string;
  accentColor: string;
  sampleTopics: string[];
  description: string;
}> = [
  {
    id: 'TECH_INTERVIEW',
    title: 'Software & System Design',
    badge: 'High Demand',
    iconName: 'code-slash',
    accentColor: '#4F46E5',
    sampleTopics: ['CAP Theorem', 'Consistent Hashing', 'Rate Limiting', 'React Fiber', 'B+ Trees'],
    description: 'Whiteboard-ready distributed architectures, caching invariants, and DSA patterns.',
  },
  {
    id: 'PM_INTERVIEW',
    title: 'Product Management',
    badge: 'FAANG Ready',
    iconName: 'rocket-outline',
    accentColor: '#0284C7',
    sampleTopics: ['CIRCLES Method', '15% Metric Drop RCA', 'A/B Test Significance', 'Scope Pushback'],
    description: 'Structured product sense, telemetry root cause frameworks, and stakeholder influence.',
  },
  {
    id: 'FINANCE_CONSULTING',
    title: 'Finance & Consulting Cases',
    badge: 'Case Prep',
    iconName: 'pie-chart-outline',
    accentColor: '#059669',
    sampleTopics: ['Profitability Trees', 'DCF Valuation', 'WACC Calculations', 'Market Entry'],
    description: 'Margin decomposition, enterprise valuation models, and quantitative case structures.',
  },
  {
    id: 'UPSC',
    title: 'UPSC Civil Services',
    badge: 'Prelims & Mains',
    iconName: 'ribbon-outline',
    accentColor: '#D97706',
    sampleTopics: ['Basic Structure Doctrine', 'Article 21 Privacy', '1857 Revolt Causes', 'Repo Rate & Inflation'],
    description: 'Landmark constitutional cases, modern history chronologies, and RBI monetary frameworks.',
  },
  {
    id: 'IIT_JEE',
    title: 'IIT-JEE Engineering Entrance',
    badge: 'Advanced & Main',
    iconName: 'flask-outline',
    accentColor: '#DC2626',
    sampleTopics: ['Rotational Dynamics', 'Gauss Law Flux', 'SN1 vs SN2', 'Gibbs Free Energy', 'Leibniz Rule'],
    description: 'Rigid body theorems, reaction mechanisms, thermodynamic spontaneity, and calculus.',
  },
  {
    id: 'NEET',
    title: 'NEET Medical Entrance',
    badge: 'Top Medical',
    iconName: 'heart-outline',
    accentColor: '#E11D48',
    sampleTopics: ['0.8s Cardiac Cycle & ECG', 'Mendelian Genetics (9:3:3:1)', 'Total Internal Reflection'],
    description: 'Human cardiac physiology, dihybrid cross ratios, and ray optics critical angles.',
  },
  {
    id: 'SCHOOL',
    title: 'Class 10 CBSE / NCERT Board',
    badge: 'Board Exams',
    iconName: 'school-outline',
    accentColor: '#7C3AED',
    sampleTopics: ['Euclids Division Lemma', 'Trigonometric Identities', 'Redox Reactions', 'Ohms Law'],
    description: 'Fundamental division algorithms, unit circle proofs, and parallel/series circuits.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Select Track',
    desc: 'Choose your exact interview track or competitive exam target.',
    icon: 'compass-outline',
    color: '#4F46E5',
  },
  {
    step: '02',
    title: '45-Sec Reels',
    desc: 'Watch ultra-dense visual micro-lessons without fluff or filler.',
    icon: 'play-circle-outline',
    color: '#0284C7',
  },
  {
    step: '03',
    title: 'Cheat Sheet',
    desc: 'Memorize visual ASCII architecture flows & 30-sec verbatim pitches.',
    icon: 'document-text-outline',
    color: '#059669',
  },
  {
    step: '04',
    title: 'Active Quizzes',
    desc: 'Lock in retention with targeted checkpoint quizzes and track mastery.',
    icon: 'checkmark-circle-outline',
    color: '#D97706',
  },
];

const PLATFORM_PILLARS = [
  {
    title: 'Whiteboard Schematics',
    subtitle: 'Clear ASCII mental models you can draw effortlessly on a whiteboard or tablet during interviews.',
    icon: 'git-network-outline',
    color: '#818CF8',
  },
  {
    title: '30-Second Verbatim Pitches',
    subtitle: 'Pre-formatted, precise answers ready to deliver when interviewers ask "Can you explain X?".',
    icon: 'mic-outline',
    color: '#38BDF8',
  },
  {
    title: 'Negative Marking Traps',
    subtitle: 'Explicit red flag alerts detailing common misstatements and exam negative marking pitfalls.',
    icon: 'alert-circle-outline',
    color: '#F87171',
  },
  {
    title: '100% Offline Persistence',
    subtitle: 'Your watched reels, bookmarks, notes, and quiz mastery survive reloads with zero latency.',
    icon: 'cloud-done-outline',
    color: '#34D399',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const viewMode = useAppStore((s) => s.viewMode);
  const setExamType = useAppStore((s) => s.setExamType);
  const { colors, isDark } = useTheme();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  const handleStartWithDomain = (trackId: DomainCategory) => {
    setExamType(trackId);
    if (trackId === 'SCHOOL') {
      router.push('/class-select');
    } else {
      router.push('/subject-select');
    }
  };

  return (
    <ScreenContainer scroll hideToggle={true}>
      {/* ⚡ Top Landing Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="body" tone="inverse">
              ⚡
            </AppText>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppText variant="bodyMedium" style={{ fontWeight: '800', letterSpacing: -0.3 }}>
                Conceptly
              </AppText>
              <View style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryBorder, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                <AppText variant="micro" tone="primary" style={{ fontWeight: '700', fontSize: 9 }}>
                  PRO
                </AppText>
              </View>
            </View>
            <AppText variant="micro" tone="muted" style={{ fontSize: 10 }}>
              Atomic clarity for everything
            </AppText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ThemeToggle compact={true} />
          {isWeb && <ViewportToggle inline={true} />}
          <Pressable
            onPress={() => router.push('/feed')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: colors.surfaceSubtle,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <AppText variant="micro" tone="secondary" style={{ fontWeight: '700' }}>
              Enter App →
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* 🚀 Main Hero Section */}
      <View className={isDesktop ? 'flex-row items-center gap-10 my-6' : 'my-4'}>
        {/* Left Column: Hero Copy & CTA */}
        <View className={isDesktop ? 'flex-1 pr-4' : ''}>
          {/* Tag Pill */}
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: 999, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="flash" size={14} color={colors.primaryText} />
            <AppText variant="caption" tone="primary" style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
              Active Visual Recall Before Interviews
            </AppText>
          </View>

          {/* Hero Title */}
          <AppText
            variant="hero"
            style={{ fontSize: isDesktop ? 40 : 28, lineHeight: isDesktop ? 46 : 34, fontWeight: '800' }}
          >
            Revise Anything Visually in{' '}
            <AppText variant="hero" tone="primary" style={{ fontSize: isDesktop ? 40 : 28, lineHeight: isDesktop ? 46 : 34, fontWeight: '800' }}>
              45 Seconds.
            </AppText>
          </AppText>

          {/* Hero Subtitle */}
          <AppText variant="body" tone="secondary" className="mt-3 leading-relaxed text-slate-600">
            Cut through 50-page textbooks and hours of lecture videos. Master system design, coding patterns,
            case frameworks, and competitive exams through ultra-dense visual reels, whiteboard ASCII flows,
            and verbatim interview pitches.
          </AppText>

          {/* Proof Badges Row */}
          <View className="flex-row flex-wrap items-center gap-3 mt-4">
            <View className="flex-row items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="time-outline" size={14} color="#475569" />
              <AppText variant="micro" className="font-bold text-slate-700">
                45s Micro-Reels
              </AppText>
            </View>
            <View className="flex-row items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="git-network-outline" size={14} color="#475569" />
              <AppText variant="micro" className="font-bold text-slate-700">
                ASCII Architecture Flows
              </AppText>
            </View>
            <View className="flex-row items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="mic-outline" size={14} color="#475569" />
              <AppText variant="micro" className="font-bold text-slate-700">
                30-Sec Pitch Scripts
              </AppText>
            </View>
          </View>

          {/* Primary Call to Actions */}
          <View className="flex-row flex-wrap items-center gap-3.5 mt-6">
            <View className="flex-1 min-w-[200px]">
              <AppButton
                label="Start Rapid Revision →"
                variant="primary"
                onPress={() => router.push('/exam-type-select')}
              />
            </View>
            <Pressable
              onPress={() => router.push('/reel/reel-cap-1?topicId=topic-cap-theorem')}
              className="px-5 py-3.5 rounded-2xl bg-white border border-slate-300 items-center justify-center flex-row gap-2 shadow-sm"
            >
              <Icon name="play" size={16} color="#4F46E5" />
              <AppText variant="bodyMedium" tone="primary" className="font-bold">
                Watch Demo Reel
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Right Column (Desktop Only): Interactive Visual Reel Studio Preview */}
        {isDesktop && (
          <View className="w-[420px]">
            <AppCard tone="default" className="border-slate-800 bg-slate-950 p-5 shadow-2xl rounded-3xl overflow-hidden">
              {/* Studio Header Mock */}
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-800">
                <View className="flex-row items-center gap-2">
                  <View className="h-3 w-3 rounded-full bg-red-500" />
                  <View className="h-3 w-3 rounded-full bg-yellow-500" />
                  <View className="h-3 w-3 rounded-full bg-green-500" />
                  <AppText variant="micro" className="text-slate-400 font-mono ml-2">
                    conceptly-studio // cap-theorem.reel
                  </AppText>
                </View>
                <View className="bg-indigo-900/60 border border-indigo-500/40 px-2 py-0.5 rounded">
                  <AppText variant="micro" className="text-indigo-300 font-bold">
                    LIVE PREVIEW
                  </AppText>
                </View>
              </View>

              {/* Mock Video Frame */}
              <View className="my-3 bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="bg-indigo-600 px-2 py-0.5 rounded-md">
                    <AppText variant="micro" className="text-white font-bold">
                      System Design & Arch
                    </AppText>
                  </View>
                  <AppText variant="micro" className="text-slate-400 font-mono">
                    0:45 • Speed 1.5x
                  </AppText>
                </View>
                <AppText variant="title" className="text-white font-bold">
                  CAP Theorem & PACELC Trade-offs
                </AppText>

                {/* ASCII Diagram Preview */}
                <View className="mt-3 bg-black/80 rounded-xl p-3 border border-slate-800">
                  <AppText variant="micro" className="text-indigo-400 font-mono text-[10px] leading-relaxed">
                    {' [ WRITE: X=2 ] ──⚡ NETWORK SPLIT ⚡── [ REPLICA: X=1 ]\n     │                                     │\n [ CP: Reject/Block ]                 [ AP: Stale Data ]'}
                  </AppText>
                </View>

                {/* 30-Sec Pitch Script */}
                <View className="mt-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-2.5">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Icon name="mic" size={12} color="#38BDF8" />
                    <AppText variant="micro" className="text-sky-300 font-bold">
                      30-Sec Interview Script
                    </AppText>
                  </View>
                  <AppText variant="micro" className="text-slate-300 italic text-[11px]" numberOfLines={2}>
                    "In any distributed network, network partitions are an inevitable physical reality. Thus our trade-off is CP vs AP..."
                  </AppText>
                </View>
              </View>

              {/* Action Buttons Mock */}
              <View className="flex-row items-center justify-between pt-1">
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <AppText variant="micro" className="text-slate-400 font-medium">
                    2/3 Checkpoints Watched
                  </AppText>
                </View>
                <Pressable
                  onPress={() => router.push('/reel/reel-cap-1?topicId=topic-cap-theorem')}
                  className="bg-indigo-600 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5"
                >
                  <Icon name="play" size={12} color="#FFFFFF" />
                  <AppText variant="micro" className="text-white font-bold">
                    Play Full Reel
                  </AppText>
                </Pressable>
              </View>
            </AppCard>
          </View>
        )}
      </View>

      {/* 📊 Trust Stats & Quantitative Bar */}
      <AppCard tone="default" style={{ marginVertical: 20, paddingVertical: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <AppText variant="h2" tone="primary" style={{ fontWeight: '800' }}>
              45s
            </AppText>
            <AppText variant="caption" tone="muted" style={{ fontWeight: '500' }}>
              Average Reel Length
            </AppText>
          </View>
          <View style={{ width: 1, height: 32, backgroundColor: colors.borderSubtle }} />
          <View style={{ alignItems: 'center' }}>
            <AppText variant="h2" tone="primary" style={{ fontWeight: '800' }}>
              37+
            </AppText>
            <AppText variant="caption" tone="muted" style={{ fontWeight: '500' }}>
              High-Yield Topics
            </AppText>
          </View>
          <View style={{ width: 1, height: 32, backgroundColor: colors.borderSubtle }} />
          <View style={{ alignItems: 'center' }}>
            <AppText variant="h2" tone="primary" style={{ fontWeight: '800' }}>
              7
            </AppText>
            <AppText variant="caption" tone="muted" style={{ fontWeight: '500' }}>
              Specialized Tracks
            </AppText>
          </View>
          <View style={{ width: 1, height: 32, backgroundColor: colors.borderSubtle }} />
          <View style={{ alignItems: 'center' }}>
            <AppText variant="h2" tone="primary" style={{ fontWeight: '800' }}>
              100%
            </AppText>
            <AppText variant="caption" tone="muted" style={{ fontWeight: '500' }}>
              Active Recall Focus
            </AppText>
          </View>
        </View>
      </AppCard>

      {/* ⚙️ How Conceptly Works (The 4-Step Engine) */}
      <View className="my-6">
        <View className="items-center text-center mb-6">
          <View className="px-3 py-0.5 bg-slate-100 rounded-full mb-1">
            <AppText variant="micro" tone="secondary" className="font-bold tracking-wider uppercase">
              The Learning Loop
            </AppText>
          </View>
          <AppText variant="h2" className="text-slate-900 font-extrabold text-center">
            How Conceptly Accelerates Your Understanding
          </AppText>
          <AppText variant="body" tone="muted" className="text-center max-w-xl mt-1">
            Built specifically for candidates who need maximum retention and mental model clarity in minimum time.
          </AppText>
        </View>

        <View className={isDesktop ? 'flex-row gap-4' : 'gap-3'}>
          {WORKFLOW_STEPS.map((s, idx) => (
            <View
              key={s.step}
              className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm ${
                isDesktop ? 'flex-1' : ''
              }`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View
                  style={{ backgroundColor: `${s.color}15` }}
                  className="h-10 w-10 rounded-xl items-center justify-center"
                >
                  <Icon name={s.icon} size={20} color={s.color} />
                </View>
                <AppText variant="caption" className="font-mono font-extrabold text-slate-300">
                  {s.step}
                </AppText>
              </View>
              <AppText variant="title" className="text-slate-900 font-bold mb-1">
                {s.title}
              </AppText>
              <AppText variant="caption" tone="secondary" className="leading-relaxed">
                {s.desc}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* 📚 What You Can Revise: The 7 Domain Tracks */}
      <View className="my-6">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <AppText variant="h2" className="text-slate-900 font-extrabold">
              Choose Your Target Track
            </AppText>
            <AppText variant="caption" tone="secondary" className="mt-0.5">
              Select any domain to immediately start watching micro-reels and taking quizzes.
            </AppText>
          </View>
          <Pressable onPress={() => router.push('/explore')}>
            <AppText variant="caption" tone="primary" className="font-bold">
              View All Topics →
            </AppText>
          </Pressable>
        </View>

        <View className={isDesktop ? 'flex-row flex-wrap gap-4' : 'gap-3'}>
          {TARGET_TRACKS.map((track) => (
            <Pressable
              key={track.id}
              style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
              onPress={() => handleStartWithDomain(track.id)}
            >
              <AppCard
                tone="default"
                className="border-slate-200 hover:border-indigo-400 transition-colors p-4 justify-between h-full"
              >
                <View>
                  {/* Track Top Row */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2.5">
                      <View
                        style={{ backgroundColor: `${track.accentColor}18` }}
                        className="h-10 w-10 rounded-xl items-center justify-center"
                      >
                        <Icon name={track.iconName} size={20} color={track.accentColor} />
                      </View>
                      <View>
                        <AppText variant="title" className="text-slate-900 font-bold">
                          {track.title}
                        </AppText>
                        <View className="flex-row items-center gap-1.5 mt-0.5">
                          <View
                            style={{ backgroundColor: track.accentColor }}
                            className="h-1.5 w-1.5 rounded-full"
                          />
                          <AppText variant="micro" tone="muted">
                            {track.badge}
                          </AppText>
                        </View>
                      </View>
                    </View>
                    <Icon name="chevron-forward" size={18} color="#94A3B8" />
                  </View>

                  <AppText variant="caption" tone="secondary" className="my-2 leading-relaxed">
                    {track.description}
                  </AppText>

                  {/* Sample Topic Chips */}
                  <View className="flex-row flex-wrap gap-1.5 mt-2">
                    {track.sampleTopics.map((topic, tIdx) => (
                      <View key={tIdx} className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        <AppText variant="micro" className="text-slate-700 font-medium">
                          {topic}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Bottom CTA on Card */}
                <View className="flex-row items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <AppText variant="micro" tone="primary" className="font-bold">
                    Start Revision Track →
                  </AppText>
                  <AppText variant="micro" tone="muted">
                    Instant Reels & Quizzes
                  </AppText>
                </View>
              </AppCard>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 💎 Why Conceptly? Platform Pillars */}
      <View className="my-6 py-6 px-5 bg-gradient-to-br from-indigo-900 to-slate-950 rounded-3xl shadow-xl">
        <View className="items-center mb-6">
          <View className="px-3 py-1 bg-indigo-800/80 rounded-full mb-2 border border-indigo-400/30">
            <AppText variant="micro" className="text-indigo-200 font-bold uppercase tracking-wider">
              High-Yield Design
            </AppText>
          </View>
          <AppText variant="h2" className="text-white font-extrabold text-center">
            Engineered for High-Pressure Revision
          </AppText>
          <AppText variant="caption" className="text-slate-300 text-center max-w-lg mt-1">
            Every screen and reel is tailored to give you maximum retention during the final 48 hours before an interview or exam.
          </AppText>
        </View>

        <View className={isDesktop ? 'flex-row flex-wrap gap-4' : 'gap-3'}>
          {PLATFORM_PILLARS.map((p, idx) => (
            <View
              key={idx}
              style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
              className="p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <View className="flex-row items-center gap-3 mb-2">
                <View
                  style={{ backgroundColor: `${p.color}25` }}
                  className="h-9 w-9 rounded-xl items-center justify-center"
                >
                  <Icon name={p.icon} size={18} color={p.color} />
                </View>
                <AppText variant="title" className="text-white font-bold">
                  {p.title}
                </AppText>
              </View>
              <AppText variant="caption" className="text-slate-300 leading-relaxed">
                {p.subtitle}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* 🏁 Bottom Call to Action Banner */}
      <AppCard tone="primarySoft" style={{ marginVertical: 24, padding: 24, alignItems: 'center' }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon name="flash" size={24} color={colors.textInverse} />
        </View>
        <AppText variant="h2" style={{ textAlign: 'center', fontWeight: '800' }}>
          Ready to Ace Your Next Round?
        </AppText>
        <AppText variant="body" tone="secondary" style={{ textAlign: 'center', maxWidth: 440, marginTop: 6, marginBottom: 20 }}>
          Select your track now and start rapid visual revision with 45-second reels, architecture schematics, and practice checkpoints.
        </AppText>

        <View style={{ width: '100%', maxWidth: 400, gap: 12 }}>
          <AppButton
            label="Start Rapid Revision →"
            variant="primary"
            onPress={() => router.push('/exam-type-select')}
          />
          <Pressable
            onPress={() => router.push('/explore')}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <AppText variant="bodyMedium" tone="secondary" style={{ fontWeight: '700' }}>
              Browse All 37+ Topics in Explorer
            </AppText>
          </Pressable>
        </View>
      </AppCard>

      {/* Footer Info */}
      <View style={{ alignItems: 'center', paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: 24 }}>
        <AppText variant="caption" tone="muted">
          ⚡ Conceptly • Atomic clarity for everything
        </AppText>
        <AppText variant="micro" tone="muted" style={{ marginTop: 4 }}>
          Bespoke micro-reels for Tech, Product, Finance, UPSC, JEE, NEET & CBSE.
        </AppText>
      </View>
    </ScreenContainer>
  );
}
