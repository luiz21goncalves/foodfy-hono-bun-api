import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  LOGGER_LEVEL: z.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ]),
})

const env = envSchema.safeParse(Bun.env)

if (env.success === false) {
  throw new Error(
    `Invalid environment variables. ${JSON.stringify(env.error.format())}`
  )
}

export const ENV = env.data
