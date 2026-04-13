import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { useAppStore } from '@/store/useAppStore';
import { analytics } from '@/services/analytics/analytics';
import { getLocalizedValue } from '@/types/i18n';

import { useHomeFeedQuery } from '../hooks/useHomeFeedQuery';
import { ReelPreviewCard } from '@/features/reels/components/ReelPreviewCard';

export default function FeedScreen() {
  const router = useRouter();

  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore((s) => s.selections.selectedSubjectId);
  const language = useAppStore((s) => s.preferences.language);

  const { data, isLoading, isError, refetch } = useHomeFeedQuery({
    classLevelId: selectedClassLevelId,
    subjectId: selectedSubjectId
  });

  const sections = data?.sections ?? [];

  const headerSubtitle = useMemo(() => {
    if (!selectedClassLevelId || !selectedSubjectId) return null;
    return 'Pick a reel to start instantly.';
  }, [selectedClassLevelId, selectedSubjectId]);

  if (isLoading) {
    return (
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4">
        <Card>
          <Text className="text-text-primary text-base font-bold">
            Loading your feed…
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Preparing lesson sequences for your class.
          </Text>
        </Card>
      </ScrollView>
    );
  }

  if (isError || !data) {
    return (
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4">
        <Card>
          <Text className="text-text-primary text-base font-bold">
            Could not load feed
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Try again in a moment.
          </Text>
          <View className="mt-4">
            <Button onPress={() => refetch()}>
              <Text className="text-text-primary text-center font-bold">
                Retry
              </Text>
            </Button>
          </View>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-4 py-4">
        <Card className="mb-4">
          <Text className="text-text-primary text-base font-extrabold">
            {headerSubtitle ?? 'Your personalized learning feed'}
          </Text>
          <Text className="text-text-muted mt-2 text-sm">
            Watch reels, then get quick practice prompts.
          </Text>
        </Card>

        {sections.map((section) => (
          <View key={section.id} className="mb-5">
            <SectionHeader
              title={getLocalizedValue(section.title, language)}
              subtitle={section.subtitle ? getLocalizedValue(section.subtitle, language) : undefined}
            />
            <View className="gap-3">
              {section.items.map((item) => (
                <ReelPreviewCard
                  key={item.id}
                  reelTitle={getLocalizedValue(item.title, language)}
                  thumbnailUrl={item.thumbnailUrl}
                  estimatedSeconds={item.estimatedSeconds}
                  difficulty={item.difficulty}
                  onPress={() => {
                    analytics.track('reel_viewed', {
                      reelId: item.reelId,
                      source: section.id
                    });
                    router.push({
                      pathname: '/topic/[topicId]/reel/[reelId]',
                      params: {
                        topicId: item.topicId,
                        reelId: item.reelId
                      }
                    });
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

