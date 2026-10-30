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

export default function ChapterSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const subjectId = useAppStore((s) => s.selectedSubjectId);
  const chapterId = useAppStore((s) => s.selectedChapterId);
  const setChapterId = useAppStore((s) => s.setChapterId);
  const language = useAppStore((s) => s.language);

  const { data, isLoading } = useQuery({
    queryKey:
      subjectId == null ? (['chapters', 'disabled'] as const) : queryKeys.chaptersBySubject(subjectId),
    queryFn: () =>
      subjectId == null ? Promise.resolve([]) : educationApi.getChaptersBySubject(subjectId),
    enabled: subjectId != null,
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
    <ScreenContainer scroll>
      <AppHeader
        title="Choose Starting Chapter"
        subtitle="Step 3 of 3 • Launch Feed"
        fallbackRoute="/subject-select"
        onBack={() => router.back()}
      />

      <View className="mt-2">
        <AppText variant="body" tone="secondary">
          Pick your starting chapter to initialize your personalized 45-second visual revision stream.
        </AppText>

        <View className="mt-5 gap-3 mb-6">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item, idx) => {
              const isSelected = chapterId === item.id;
              const titleText =
                typeof item.title === 'object' ? item.title[language] ?? item.title.en : item.title;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setChapterId(item.id)}
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
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                      }}
                    >
                      <AppText
                        variant="caption"
                        style={{
                          fontWeight: '800',
                          color: isSelected ? colors.textInverse : colors.textSecondary,
                        }}
                      >
                        {idx + 1}
                      </AppText>
                    </View>
                    <AppText
                      variant="bodyMedium"
                      style={{
                        fontWeight: '700',
                        color: isSelected ? colors.primaryText : colors.textPrimary,
                        flex: 1,
                      }}
                    >
                      {titleText}
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
      </View>

      <View className="pt-2 pb-4">
        <AppButton
          label="Launch Personalized Feed 🚀"
          disabled={chapterId == null}
          onPress={() => router.replace('/feed')}
        />
      </View>
    </ScreenContainer>
  );
}
