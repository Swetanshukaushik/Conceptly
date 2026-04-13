import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

import { cx } from '@/utils/cx';

export type AppTextProps = TextProps & {
  className?: string;
};

export function Text({ className, ...props }: AppTextProps) {
  return (
    <RNText className={cx('text-text-primary', className)} {...props} />
  );
}

