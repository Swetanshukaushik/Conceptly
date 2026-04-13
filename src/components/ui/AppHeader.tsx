import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cx } from '@/utils/cx';

export function AppHeader({
  title,
  subtitle,
  onBack,
  right,
  className
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={cx('px-4 pt-2 pb-3', className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-secondary"
            >
              <Text className="text-text-primary text-sm font-extrabold">
                ‹
              </Text>
            </Pressable>
          ) : null}
          <View className="flex-1">
            <Text className="text-text-primary text-lg font-extrabold">
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-text-muted mt-0.5 text-xs">
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {right ? <View className="ml-3">{right}</View> : null}
      </View>
    </View>
  );
}

