import { ENV } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  schema: './src/db/schema/index.ts',
})
