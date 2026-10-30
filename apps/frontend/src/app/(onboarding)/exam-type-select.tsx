import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { Icon } from '@/components/ui/Icon';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { EXAM_TYPES_WITH_REAL_REELS } from '@/services/api/mockData';

const domainCategories = [
  {
    id: 'TECH_INTERVIEW',
    label: '💻 Software & System Design Interview',
    description: 'System Design, Distributed Architecture, DSA, React & Backend Internals',
  },
  {
    id: 'PM_INTERVIEW',
    label: '🚀 Product Management Interview',
    description: 'CIRCLES framework, North Star metrics, A/B experimentation & execution',
  },
  {
    id: 'FINANCE_CONSULTING',
    label: '📊 Finance & Consulting Cases',
    description: 'DCF Valuation, M&A, Profitability Trees & MBB Case Frameworks',
  },
  {
    id: 'UPSC',
    label: '🏛️ UPSC Civil Services',
    description: 'Indian Polity, Basic Structure, Modern History & Macro Economy',
  },
  {
    id: 'IIT_JEE',
    label: '📐 IIT JEE Engineering',
    description: 'Rotational Mechanics, Electrodynamics, Organic Chemistry & Calculus',
  },
  {
    id: 'NEET',
    label: '🩺 NEET Medical Entrance',
    description: 'Human Physiology, Cardiac Cycle, Molecular Genetics & Medical Physics',
  },
  {
    id: 'SCHOOL',
    label: '🎒 NCERT School (Classes 6–10)',
    description: 'Board exam visual concepts across Mathematics, Science & Social Studies',
  },
] as const;

export default function ExamTypeSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const setExamType = useAppStore((s) => s.setExamType);
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);

  const visibleCategories = onlyTopicsWithReels
    ? domainCategories.filter((cat) => EXAM_TYPES_WITH_REAL_REELS.has(cat.id))
    : domainCategories;

  return (
    <ScreenContainer className="justify-between">
      <AppHeader
        title="Target Learning Track"
        subtitle="Step 1 of 3 • Cognitive Calibration"
        onBack={() => router.back()}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-2">
        <AppText variant="body" tone="secondary">
          Select your primary target domain to calibrate high-yield 45-second visual reels, interactive schematics, and exam marking schemes.
        </AppText>

        <View className="mt-4 gap-3 mb-6">
          {visibleCategories.map((cat) => {
            const isSelected = selectedExamType === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setExamType(cat.id)}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <AppText
                    variant="bodyMedium"
                    style={{
                      fontWeight: '700',
                      color: isSelected ? colors.primaryText : colors.textPrimary,
                    }}
                  >
                    {cat.label}
                  </AppText>
                  <AppText variant="caption" tone="secondary" style={{ marginTop: 4 }}>
                    {cat.description}
                  </AppText>
                </View>
                <Icon
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="pt-2 pb-4">
        <AppButton
          label="Continue to Subjects →"
          disabled={selectedExamType == null}
          onPress={() => {
            if (selectedExamType === 'SCHOOL') {
              router.push('/class-select');
            } else {
              router.push('/subject-select');
            }
          }}
        />
      </View>
    </ScreenContainer>
  );
}
