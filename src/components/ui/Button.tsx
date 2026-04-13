import React from 'react';
import { Platform, Pressable, type PressableProps } from 'react-native';

import { cx } from '@/utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export function Button({
  className,
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      hitSlop={10}
      android_ripple={
        Platform.OS === 'android' && variant !== 'primary'
          ? { color: 'rgba(255,255,255,0.08)' }
          : undefined
      }
      className={cx(
        'rounded-xl px-4 py-3',
        'flex-row items-center justify-center',
        'active:opacity-85',
        disabled && 'opacity-50',
        variant === 'primary' && 'bg-brand500 shadow-soft',
        variant === 'secondary' && 'bg-bg-secondary border border-border',
        variant === 'ghost' && 'bg-transparent border border-border',
        className
      )}
      {...props}
    />
  );
}

