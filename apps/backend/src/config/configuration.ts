import type { AppEnv } from './env.schema';

export const configuration = (env: AppEnv) => ({
  env: env.NODE_ENV,
  port: env.PORT,
  database: {
    url: env.DATABASE_URL
  },
  redis: {
    url: env.REDIS_URL
  }
});

export type AppConfig = ReturnType<typeof configuration>;

