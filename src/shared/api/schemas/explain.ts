import { z } from 'zod';

/**
 * One node of the backend's recursive scoring explanation tree.
 *
 * The tree is unbounded in depth; the backend does not cap it. We model
 * it with a lazy schema so that arbitrarily deep explanations validate.
 */
export interface ScoreExplanation {
  value: number;
  description: string;
  details: ScoreExplanation[];
}

export const ScoreExplanationSchema: z.ZodType<ScoreExplanation> = z.lazy(() =>
  z.object({
    value: z.number(),
    description: z.string(),
    details: z.array(ScoreExplanationSchema),
  }),
);

export const ExplainRequestSchema = z.object({
  query: z.string().min(1),
  document_id: z.string().min(1),
});

export const ExplainResponseSchema = z.object({
  matched: z.boolean(),
  explanation: ScoreExplanationSchema.nullable(),
});

export type ExplainRequest = z.infer<typeof ExplainRequestSchema>;
export type ExplainResponse = z.infer<typeof ExplainResponseSchema>;
