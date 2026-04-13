import React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

import { cx } from '@/utils/cx';

export type LoaderProps = ActivityIndicatorProps & {
  className?: string;
};

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <ActivityIndicator
      className={cx(className)}
      color={props.color ?? '#0F6BFF'}
      {...props}
    />
  );
}

