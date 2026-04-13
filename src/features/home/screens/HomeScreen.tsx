import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';

import FeedScreen from '@/features/feed/screens/FeedScreen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const router = useRouter();
  const selectedClassLevelId = useAppStore(
    (s) => s.selections.selectedClassLevelId
  );
  const selectedSubjectId = useAppStore((s) => s.selections.selectedSubjectId);
  const selectedChapterId = useAppStore((s) => s.selections.selectedChapterId);

  return (
    <View className="flex-1 bg-bg-primary">
      <View className="px-4 pt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-text-primary text-xl font-extrabold">
            Conceptly
          </Text>
          <View className="flex-row gap-2">
            <Button
              variant="ghost"
              className="px-3"
              onPress={() =>
                router.push({
                  pathname: '/explore'
                })
              }
              disabled={
                selectedClassLevelId == null ||
                selectedSubjectId == null ||
                selectedChapterId == null
              }
            >
              <Text className="text-text-primary text-sm font-bold">
                Explore
              </Text>
            </Button>
            <Button
              variant="ghost"
              className="px-3"
              onPress={() => router.push({ pathname: '/bookmarks' })}
            >
              <Text className="text-text-primary text-sm font-bold">Saved</Text>
            </Button>
            <Button
              variant="ghost"
              className="px-3"
              onPress={() => router.push({ pathname: '/progress' })}
              disabled={selectedChapterId == null}
            >
              <Text className="text-text-primary text-sm font-bold">
                Progress
              </Text>
            </Button>
            <Button
              variant="ghost"
              className="px-3"
              onPress={() => router.push({ pathname: '/profile' })}
            >
              <Text className="text-text-primary text-sm font-bold">Profile</Text>
            </Button>
          </View>
        </View>

        <View className="mt-2">
          <Text className="text-text-muted text-xs">
            Continue learning with structured reels + quick quizzes.
          </Text>
        </View>
      </View>

      <FeedScreen />
    </View>
  );
}

