import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379')
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown>): AppEnv {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Environment validation failed: ${message}`);
  }

  return result.data;
}

