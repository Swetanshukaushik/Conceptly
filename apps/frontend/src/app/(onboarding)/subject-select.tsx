import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';

export default function SubjectSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const classId = useAppStore((s) => s.selectedClassId);
  const selectedSubjectId = useAppStore((s) => s.selectedSubjectId);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const language = useAppStore((s) => s.language);

  const { data, isLoading } = useQuery({
    queryKey:
      selectedExamType === 'SCHOOL' && classId != null
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
    enabled: selectedExamType != null && (selectedExamType !== 'SCHOOL' || classId != null),
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
      <AppHeader
        title="Choose Your Subject"
        subtitle="Step 2 of 3 • Core Discipline"
        onBack={() => router.back()}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-2">
        <AppText variant="body" tone="secondary">
          Select the subject module you want to focus on first. You can switch subjects anytime from Explore or Search.
        </AppText>

        <View className="mt-5 gap-3 mb-6">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item) => {
              const isSelected = selectedSubjectId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSubjectId(item.id)}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                      }}
                    >
                      <Icon
                        name="book-outline"
                        size={18}
                        color={isSelected ? colors.textInverse : colors.primaryText}
                      />
                    </View>
                    <AppText
                      variant="bodyMedium"
                      style={{
                        fontWeight: '700',
                        color: isSelected ? colors.primaryText : colors.textPrimary,
                      }}
                    >
                      {item.label[language] ?? item.label.en}
                    </AppText>
                  </View>
                  <Icon
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <View className="pt-2 pb-4">
        <AppButton
          label="Next: Select Chapter →"
          disabled={selectedSubjectId == null}
          onPress={() => router.push('/chapter-select')}
        />
      </View>
    </ScreenContainer>
  );
}
