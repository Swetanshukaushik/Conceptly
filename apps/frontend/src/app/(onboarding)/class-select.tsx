import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { AppButton } from '@/components/ui/AppButton';
import { Loader } from '@/components/ui/Loader';

import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';

export default function ClassSelectScreen() {
  const router = useRouter();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const selectedClassId = useAppStore((s) => s.selectedClassId);
  const setClassId = useAppStore((s) => s.setClassId);
  const language = useAppStore((s) => s.language);

  // Redirect if not SCHOOL exam type
  React.useEffect(() => {
    if (selectedExamType !== 'SCHOOL') {
      router.replace('/subject-select');
    }
  }, [selectedExamType, router]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.classes(),
    queryFn: () => educationApi.getClasses()
  });

  return (
    <ScreenContainer className="justify-between">
      <View>
        <AppText variant="h1">Choose your class</AppText>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {isLoading ? (
            <Loader />
          ) : (
            (data ?? []).map((item) => (
              <Chip
                key={item.id}
                label={item.label[language]}
                variant={selectedClassId === item.id ? "selected" : "default"}
                onPress={() => setClassId(item.id)}
              />
            ))
          )}
        </View>
      </View>
      <AppButton
        label="Next"
        disabled={selectedClassId == null}
        onPress={() => router.push('/subject-select')}
      />
    </ScreenContainer>
  );
}

