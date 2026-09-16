import { useId, type ComponentProps } from 'react';

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'className'> {
  label: string;
  hint?: string;
}

export function Checkbox({ label, hint, id, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex items-start gap-2">
      <input
        {...rest}
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border-[var(--color-border-strong)] text-[var(--color-accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex flex-col">
        <label htmlFor={inputId} className="text-sm text-[var(--color-fg)]">
          {label}
        </label>
        {hint ? <span className="text-xs text-[var(--color-fg-muted)]">{hint}</span> : null}
      </div>
    </div>
  );
}
