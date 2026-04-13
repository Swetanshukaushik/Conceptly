import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';

export type ReelPreviewCardProps = {
  reelTitle: string;
  thumbnailUrl: string;
  estimatedSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onPress: () => void;
};

function difficultyLabel(d: 'easy' | 'medium' | 'hard') {
  switch (d) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
  }
}

export function ReelPreviewCard({
  reelTitle,
  thumbnailUrl,
  estimatedSeconds,
  difficulty,
  onPress
}: ReelPreviewCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="overflow-hidden p-3">
        <View className="flex-row gap-3">
          <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-bg-secondary">
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-text-primary text-sm font-extrabold">
              {reelTitle}
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
              <Chip className="px-2 py-1" selected={false}>
                <Text className="text-text-primary text-[11px] font-bold">
                  {difficultyLabel(difficulty)}
                </Text>
              </Chip>
              <Text className="text-text-muted text-[12px]">
                {Math.round(estimatedSeconds / 60)}m
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

