import { useId, type ComponentProps } from 'react';

interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'className'> {
  label: string;
}

export function Switch({ label, id, ...rest }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelTextId = `${inputId}-label`;

  return (
    <div className="flex items-center gap-3">
      <input
        {...rest}
        id={inputId}
        type="checkbox"
        role="switch"
        aria-labelledby={labelTextId}
        className="peer sr-only"
      />
      <label
        htmlFor={inputId}
        aria-hidden="true"
        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-[var(--color-border-strong)] transition-colors peer-checked:bg-[var(--color-accent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        <span className="pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform peer-checked:translate-x-4" />
      </label>
      <span id={labelTextId} className="text-sm text-[var(--color-fg)]">
        {label}
      </span>
    </div>
  );
}
