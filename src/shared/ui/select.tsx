import { useId, type ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<ComponentProps<'select'>, 'className'> {
  label: string;
  options: readonly SelectOption[];
  hint?: string;
}

export function Select({ label, options, hint, id, ...rest }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-fg)]">
        {label}
      </label>
      <select
        {...rest}
        id={inputId}
        aria-describedby={describedById}
        className={cn(
          'h-9 w-full rounded-[var(--radius-md)] border px-3 text-sm',
          'bg-[var(--color-surface)] text-[var(--color-fg)]',
          'border-[var(--color-border-strong)]',
          'focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-fg-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
