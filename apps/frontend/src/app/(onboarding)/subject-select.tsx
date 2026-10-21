import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { AppButton } from '@/components/ui/AppButton';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';

import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';

export default function SubjectSelectScreen() {
  const router = useRouter();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const classId = useAppStore((s) => s.selectedClassId);
  const selectedSubjectId = useAppStore((s) => s.selectedSubjectId);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const language = useAppStore((s) => s.language);

  const { data, isLoading } = useQuery({
    queryKey: selectedExamType === 'SCHOOL' && classId != null
      ? queryKeys.subjectsByClass(classId)
      : selectedExamType != null
      ? ['subjects', 'by-exam-type', selectedExamType]
      : (['subjects', 'disabled'] as const),
    queryFn: () => {
      if (selectedExamType === 'SCHOOL' && classId != null) {
        return educationApi.getSubjectsByClass(classId);
      } else if (selectedExamType != null) {
        return educationApi.getSubjectsByExamType(selectedExamType);
      }
      return Promise.resolve([]);
    },
    enabled: selectedExamType != null && (selectedExamType !== 'SCHOOL' || classId != null)
  });

  if (selectedExamType == null) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Select exam type first"
          actionLabel="Go back"
          onPressAction={() => router.replace('/exam-type-select')}
        />
      </ScreenContainer>
    );
  }

  if (selectedExamType === 'SCHOOL' && classId == null) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Select class first"
          actionLabel="Go back"
          onPressAction={() => router.replace('/class-select')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="justify-between">
      <View>
        <AppText variant="h1">Choose your subject</AppText>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item) => (
              <Chip
                key={item.id}
                label={item.label[language]}
                variant={selectedSubjectId === item.id ? "selected" : "default"}
                onPress={() => setSubjectId(item.id)}
              />
            ))
          )}
        </View>
      </View>
      <AppButton
        label="Next"
        disabled={selectedSubjectId == null}
        onPress={() => router.push('/chapter-select')}
      />
    </ScreenContainer>
  );
}

