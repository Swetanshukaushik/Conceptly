import React from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { cx } from '@/utils/cx';

export type ChipProps = Omit<PressableProps, 'style'> & {
  className?: string;
  selected?: boolean;
};

export function Chip({ className, selected, ...props }: ChipProps) {
  return (
    <Pressable
      className={cx(
        'rounded-full px-3 py-2',
        'border border-border',
        selected ? 'bg-brand500/20 border-brand500' : 'bg-bg-card',
        className
      )}
      {...props}
    />
  );
}

