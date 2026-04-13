import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  type ImageProps
} from 'react-native';

import { cx } from '@/utils/cx';

export type AvatarProps = Omit<ImageProps, 'source'> & {
  className?: string;
  size?: number;
  source?: ImageSourcePropType;
};

export function Avatar({
  className,
  size = 40,
  source,
  ...props
}: AvatarProps) {
  return (
    <Image
      source={source}
      resizeMode="cover"
      className={cx('rounded-full bg-bg-card', className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

