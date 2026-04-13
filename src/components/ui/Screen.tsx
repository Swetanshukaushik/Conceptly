import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';

import { cx } from '@/utils/cx';

export type ScreenProps = SafeAreaViewProps & {
  className?: string;
};

export function Screen({ className, ...props }: ScreenProps) {
  return (
    <SafeAreaView
      edges={props.edges ?? ['top', 'bottom']}
      className={cx('flex-1 bg-bg-primary', className)}
      {...props}
    />
  );
}

