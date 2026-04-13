import React from 'react';
import { View, type ViewProps } from 'react-native';

import { cx } from '@/utils/cx';

export type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cx(
        'bg-bg-card border border-border rounded-lg p-4',
        className
      )}
      {...props}
    />
  );
}

