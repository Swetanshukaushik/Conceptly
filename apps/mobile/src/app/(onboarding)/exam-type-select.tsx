import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { AppButton } from '@/components/ui/AppButton';

import { useAppStore } from '@/store/useAppStore';

const examTypes = [
  { id: 'SCHOOL', label: 'School Student', description: 'NCERT Curriculum' },
  { id: 'UPSC', label: 'UPSC Aspirant', description: 'Civil Services Preparation' },
  { id: 'IIT_JEE', label: 'IIT JEE Aspirant', description: 'Engineering Entrance' },
  { id: 'NEET', label: 'NEET Aspirant', description: 'Medical Entrance' }
] as const;

export default function ExamTypeSelectScreen() {
  const router = useRouter();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const setExamType = useAppStore((s) => s.setExamType);

  return (
    <ScreenContainer className="justify-between">
      <View>
        <AppText variant="h1">
          What are you preparing for?
        </AppText>
        <AppText variant="body" tone="secondary" className="mt-2">
          Choose your exam type to get personalized content
        </AppText>

        <View className="mt-6 gap-3">
          {examTypes.map((examType) => (
            <Chip
              key={examType.id}
              label={examType.label}
              variant={selectedExamType === examType.id ? "selected" : "default"}
              onPress={() => setExamType(examType.id)}
            />
          ))}
        </View>
      </View>

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
    </ScreenContainer>
  );
}