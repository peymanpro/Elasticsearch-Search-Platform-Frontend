/**
 * Join class names, dropping falsy values.
 *
 * This is intentionally simpler than clsx + tailwind-merge. The
 * primitives in this folder use a fixed set of variants and do not
 * accept caller-supplied Tailwind classes that would need conflict
 * resolution. When a caller needs to extend a primitive, that is a
 * signal the primitive should grow a variant, not a className escape
 * hatch.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value) continue;
    out = out.length === 0 ? value : `${out} ${value}`;
  }
  return out;
}
