import { useId, type ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'className'> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, id, rows = 4, ...rest }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-fg)]">
        {label}
      </label>
      <textarea
        {...rest}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={cn(
          'w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm',
          'bg-[var(--color-surface)] text-[var(--color-fg)]',
          'placeholder:text-[var(--color-fg-subtle)]',
          'focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',
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
