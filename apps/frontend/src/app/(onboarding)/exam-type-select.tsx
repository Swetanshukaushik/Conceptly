import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { AppButton } from '@/components/ui/AppButton';

import { useAppStore } from '@/store/useAppStore';

const domainCategories = [
  { id: 'TECH_INTERVIEW', label: '💻 Software & System Design Interview', description: 'System Design, DSA, Frontend, Backend' },
  { id: 'PM_INTERVIEW', label: '🚀 Product Management Interview', description: 'CIRCLES framework, metrics, product sense' },
  { id: 'FINANCE_CONSULTING', label: '📊 Finance & Consulting Cases', description: 'Valuation, profitability, case frameworks' },
  { id: 'UPSC', label: '🏛️ UPSC Civil Services', description: 'Polity, Governance, Modern History' },
  { id: 'IIT_JEE', label: '📐 IIT JEE Engineering', description: 'Physics, Chemistry, Advanced Math' },
  { id: 'NEET', label: '🩺 NEET Medical Entrance', description: 'Biology, Zoology, Physics' },
  { id: 'SCHOOL', label: '🎒 NCERT School (Classes 6–10)', description: 'Board exam visual concepts' },
] as const;

export default function ExamTypeSelectScreen() {
  const router = useRouter();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const setExamType = useAppStore((s) => s.setExamType);

  return (
    <ScreenContainer className="justify-between">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <AppText variant="h1">
          What are you revising for?
        </AppText>
        <AppText variant="body" tone="secondary" className="mt-2">
          Pick your target domain to get rapid visual reels before your big interview or exam.
        </AppText>

        <View className="mt-6 gap-3 mb-6">
          {domainCategories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              variant={selectedExamType === cat.id ? 'selected' : 'default'}
              onPress={() => setExamType(cat.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="pt-2">
        <AppButton
          label="Continue"
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
