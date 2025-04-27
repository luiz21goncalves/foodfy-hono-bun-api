import { ENV } from '@/env'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import * as schema from './schema'

const client = new SQL(ENV.DATABASE_URL)
export const db = drizzle({ client, schema })
