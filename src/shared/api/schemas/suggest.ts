import { z } from 'zod';

import { MAX_SUGGEST_LIMIT, MIN_SUGGEST_LIMIT } from '@/shared/config/search-constants';

export const SuggestRequestSchema = z.object({
  q: z.string().min(1),
  limit: z.number().int().min(MIN_SUGGEST_LIMIT).max(MAX_SUGGEST_LIMIT).optional(),
});

export const SuggestResponseSchema = z.object({
  prefix: z.string(),
  suggestions: z.array(z.string()),
});

export type SuggestRequest = z.infer<typeof SuggestRequestSchema>;
export type SuggestResponse = z.infer<typeof SuggestResponseSchema>;
