import { useId, type ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

interface InputProps extends Omit<ComponentProps<'input'>, 'className'> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-fg)]">
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={cn(
          'h-9 w-full rounded-[var(--radius-md)] border px-3 text-sm',
          'bg-[var(--color-surface)] text-[var(--color-fg)]',
          'placeholder:text-[var(--color-fg-subtle)]',
          'focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)]',
        )}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-fg-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
