export const explainKeys = {
  all: ['explain'] as const,
  byQueryAndDoc: (query: string, documentId: string) => ['explain', query, documentId] as const,
};
