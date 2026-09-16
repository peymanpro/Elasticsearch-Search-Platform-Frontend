import { z } from 'zod';

export const HealthStatusSchema = z.enum(['healthy', 'degraded', 'unhealthy']);

export const ClusterHealthSchema = z.object({
  name: z.string(),
  status: z.string(),
  number_of_nodes: z.number().int(),
});

export const IndexHealthSchema = z.object({
  alias: z.string(),
  points_at: z.string().nullable(),
  document_count: z.number().int(),
});

export const HealthResponseSchema = z.object({
  status: HealthStatusSchema,
  cluster: ClusterHealthSchema,
  index: IndexHealthSchema,
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type HealthStatus = z.infer<typeof HealthStatusSchema>;
