import { useEffect, useState } from 'react';

/**
 * Return a debounced copy of `value`.
 *
 * The returned value only updates after `delayMs` has elapsed without
 * `value` changing. Any pending timer is cleared when the input changes
 * again or when the component unmounts.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      window.clearTimeout(handle);
    };
  }, [value, delayMs]);

  return debounced;
}
