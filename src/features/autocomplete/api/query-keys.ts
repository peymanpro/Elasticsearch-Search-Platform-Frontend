export const suggestKeys = {
  all: ['suggest'] as const,
  byPrefix: (prefix: string, limit: number | undefined) =>
    ['suggest', prefix, limit ?? null] as const,
};
