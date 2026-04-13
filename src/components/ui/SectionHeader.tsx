import React from 'react';
import { View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cx } from '@/utils/cx';

export type SectionHeaderProps = ViewProps & {
  className?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function SectionHeader({
  className,
  title,
  subtitle,
  right,
  ...props
}: SectionHeaderProps) {
  return (
    <View
      className={cx('mb-3 flex-row items-end justify-between', className)}
      {...props}
    >
      <View className="flex-1">
        <Text className="text-text-primary text-lg font-bold">{title}</Text>
        {subtitle ? (
          <Text className="text-text-muted mt-1 text-xs">{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View className="ml-3">{right}</View> : null}
    </View>
  );
}

