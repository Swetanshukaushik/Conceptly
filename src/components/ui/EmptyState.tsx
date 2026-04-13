import React from 'react';
import { View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cx } from '@/utils/cx';

export type EmptyStateProps = ViewProps & {
  className?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  className,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={cx('items-center justify-center px-6 py-10', className)}
      {...props}
    >
      <Text className="text-text-primary text-base font-semibold text-center">
        {title}
      </Text>
      {description ? (
        <Text className="text-text-muted mt-2 text-sm text-center">
          {description}
        </Text>
      ) : null}
      {action ? <View className="mt-5 w-full">{action}</View> : null}
    </View>
  );
}

