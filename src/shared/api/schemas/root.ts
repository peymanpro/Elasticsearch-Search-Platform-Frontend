import { z } from 'zod';

export const ServiceRootResponseSchema = z.object({
  service: z.string(),
  status: z.enum(['healthy', 'degraded']),
});

export type ServiceRootResponse = z.infer<typeof ServiceRootResponseSchema>;
