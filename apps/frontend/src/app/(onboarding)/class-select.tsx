import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { Loader } from '@/components/ui/Loader';
import { Icon } from '@/components/ui/Icon';

import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';

export default function ClassSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const selectedClassId = useAppStore((s) => s.selectedClassId);
  const setClassId = useAppStore((s) => s.setClassId);
  const language = useAppStore((s) => s.language);

  React.useEffect(() => {
    if (selectedExamType !== 'SCHOOL') {
      router.replace('/subject-select');
    }
  }, [selectedExamType, router]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.classes(),
    queryFn: () => educationApi.getClasses(),
  });

  return (
    <ScreenContainer scroll>
      <View>
        <AppHeader
          title="Select Class Level"
          subtitle="NCERT Board Curriculum"
          fallbackRoute="/exam-type-select"
          onBack={() => router.back()}
        />
        <AppText variant="body" tone="secondary" className="mt-2">
          Choose your current class to unlock curriculum-aligned visual chapters.
        </AppText>

        <View className="mt-6 gap-3 mb-6">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item) => {
              const isSelected = selectedClassId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setClassId(item.id)}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <AppText
                    variant="bodyMedium"
                    style={{
                      fontWeight: '700',
                      color: isSelected ? colors.primaryText : colors.textPrimary,
                    }}
                  >
                    🎒 {item.label[language] ?? item.label.en}
                  </AppText>
                  <Icon
                    name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                    size={18}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              );
            })
          )}
        </View>
      </View>

      <View className="pb-4">
        <AppButton
          label="Next: Select Subject →"
          disabled={selectedClassId == null}
          onPress={() => router.push('/subject-select')}
        />
      </View>
    </ScreenContainer>
  );
}
