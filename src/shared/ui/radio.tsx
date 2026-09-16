import { useId, type ComponentProps } from 'react';

interface RadioProps extends Omit<ComponentProps<'input'>, 'type' | 'className'> {
  label: string;
}

export function Radio({ label, id, ...rest }: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <input
        {...rest}
        id={inputId}
        type="radio"
        className="h-4 w-4 shrink-0 border-[var(--color-border-strong)] text-[var(--color-accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <label htmlFor={inputId} className="text-sm text-[var(--color-fg)]">
        {label}
      </label>
    </div>
  );
}
