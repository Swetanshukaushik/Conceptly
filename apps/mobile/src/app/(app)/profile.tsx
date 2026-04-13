import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';

import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { selectedExamType, selectedClassId } = useAppStore();

  return (
    <ScreenContainer scroll>
      <AppHeader title="Profile" onBack={() => router.back()} />

      <AppCard className="mb-6">
        <AppText variant="title">Student Profile</AppText>
        <AppText variant="body" tone="secondary" className="mt-2">
          Exam Type: {selectedExamType || 'Not selected'}
        </AppText>
        {selectedClassId && (
          <AppText variant="body" tone="secondary" className="mt-1">
            Class: {selectedClassId}
          </AppText>
        )}
      </AppCard>

      <View className="gap-3">
        <AppButton
          label="Change Exam Type"
          variant="secondary"
          onPress={() => router.push('/exam-type-select')}
        />
        <AppButton
          label="Change Class"
          variant="secondary"
          onPress={() => router.push('/class-select')}
        />
        <AppButton
          label="Change Subject"
          variant="secondary"
          onPress={() => router.push('/subject-select')}
        />
      </View>
    </ScreenContainer>
  );
}

