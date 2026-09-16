import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string | undefined;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90 active:opacity-80',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]',
  ghost: 'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 active:opacity-80',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled === true || loading;
  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {loading ? <span aria-hidden="true">…</span> : null}
      {children}
    </button>
  );
}
