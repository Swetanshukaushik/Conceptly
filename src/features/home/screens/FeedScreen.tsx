import React from 'react';
import { ScrollView, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';

export default function FeedScreen() {
  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          <View className="mb-4">
            <Text className="text-text-primary text-2xl font-extrabold">
              Today for you
            </Text>
            <Text className="text-text-muted mt-1 text-sm">
              Quick reels, short quizzes, measurable progress.
            </Text>
          </View>

          <SectionHeader title="Continue learning" />

          <Card className="mb-4">
            <Text className="text-text-primary text-base font-bold">
              Topic: Fractions (Scene 2/5)
            </Text>
            <Text className="text-text-muted mt-1 text-sm">
              2 minutes left • Difficulty: Medium
            </Text>
          </Card>

          <SectionHeader
            title="Recommended for you"
            subtitle="Based on your last sessions"
          />

          <Card className="mb-4">
            <Text className="text-text-primary text-base font-bold">
              Reel: Understanding fractions visually
            </Text>
            <Text className="text-text-muted mt-1 text-sm">
              Includes a 3-question quiz after viewing
            </Text>
          </Card>

          <SectionHeader
            title="Quick revision"
            subtitle="High-impact concepts"
          />
          <Card>
            <Text className="text-text-primary text-base font-bold">
              Reel: Equivalent fractions
            </Text>
            <Text className="text-text-muted mt-1 text-sm">
              Review in under 60 seconds
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

