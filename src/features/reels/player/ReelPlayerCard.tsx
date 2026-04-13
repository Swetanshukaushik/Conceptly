import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';

import type { ReelWithContext } from './types';

export type ReelPlayerCardProps = {
  item: ReelWithContext;
  isActive: boolean;
  progressPercent: number; // 0..1 (MVP simulation)
  language: 'en' | 'hi';
  onPressQuiz: () => void;
  onPressBookmark: () => void;
  isBookmarked: boolean;
};

export function ReelPlayerCard({
  item,
  isActive,
  progressPercent,
  onPressQuiz,
  onPressBookmark,
  isBookmarked,
  language
}: ReelPlayerCardProps) {
  const active = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive, active]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.85 + active.value * 0.15
    };
  });

  const progressWidth = `${Math.round(progressPercent * 100)}%` as const;

  const topicTitle = item.topic.title[language] ?? item.topic.title.en;

  return (
    <Animated.View style={overlayStyle} className="flex-1">
      <View className="flex-1 bg-bg-secondary">
        <Image
          source={{ uri: item.reel.thumbnailUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        <View className="absolute left-0 right-0 top-0 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-white text-base font-extrabold">
                {topicTitle}
              </Text>
              <Text className="text-text-muted mt-1 text-xs">
                {item.reel.estimatedSeconds} sec • {item.reel.difficulty}
              </Text>
            </View>
            <View className="items-end">
              <Chip
                selected
                className="border-brand500/30 bg-brand500/20"
                onPress={() => {}}
              >
                <Text className="text-text-primary text-[11px] font-bold">
                  Scene {item.reel.scenes.length ? 1 : 0}/{item.reel.scenes.length}
                </Text>
              </Chip>
            </View>
          </View>
          <View className="mt-3 h-1 w-full rounded-full bg-bg-card/60">
            <View
              className="h-1 rounded-full bg-brand500"
              style={{ width: progressWidth as any }}
            />
          </View>
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Card className="bg-bg-card/80 border-border">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-text-primary text-sm font-extrabold">
                  {item.reel.title[language] ?? item.reel.title.en}
                </Text>
                <Text className="text-text-muted mt-1 text-xs">
                  {item.reel.subtitle
                    ? item.reel.subtitle[language] ?? item.reel.subtitle.en
                    : null}
                </Text>
              </View>
              <View className="items-end gap-2">
                <Text
                  className="text-text-muted text-[11px]"
                >
                  {isBookmarked ? 'Saved' : 'Not saved'}
                </Text>
                <Chip
                  className="bg-transparent"
                  selected={isBookmarked}
                  onPress={onPressBookmark}
                >
                  <Text className="text-text-primary text-[11px] font-bold">
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Text>
                </Chip>
              </View>
            </View>

            <View className="mt-3 flex-row gap-2">
              <Animated.View>
                <Chip
                  selected
                  className="flex-1 justify-center border-brand500/30 bg-brand500/20"
                  onPress={onPressQuiz}
                >
                  <Text className="text-text-primary text-[11px] font-bold">
                    Test yourself
                  </Text>
                </Chip>
              </Animated.View>
            </View>
          </Card>
        </View>
      </View>
    </Animated.View>
  );
}

