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

export default function ChapterSelectScreen() {
  const router = useRouter();
  const subjectId = useAppStore((s) => s.selectedSubjectId);
  const chapterId = useAppStore((s) => s.selectedChapterId);
  const setChapterId = useAppStore((s) => s.setChapterId);
  const language = useAppStore((s) => s.language);

  const { data, isLoading } = useQuery({
    queryKey: subjectId == null ? (['chapters', 'disabled'] as const) : queryKeys.chaptersBySubject(subjectId),
    queryFn: () =>
      subjectId == null
        ? Promise.resolve([])
        : educationApi.getChaptersBySubject(subjectId),
    enabled: subjectId != null
  });

  if (subjectId == null) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Select subject first"
          actionLabel="Go back"
          onPressAction={() => router.replace('/subject-select')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="justify-between">
      <View>
        <AppText variant="h1">Choose your chapter</AppText>
        <View className="mt-4 flex-col gap-2">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item) => (
              <Chip
                key={item.id}
                label={item.title[language]}
                variant={chapterId === item.id ? "selected" : "default"}
                onPress={() => setChapterId(item.id)}
              />
            ))
          )}
        </View>
      </View>
      <AppButton
        label="Continue"
        disabled={chapterId == null}
        onPress={() => router.replace('/feed')}
      />
    </ScreenContainer>
  );
}

