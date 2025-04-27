import { afterAll, beforeAll } from 'bun:test'
import { execSync } from 'node:child_process'
import { db } from '@/db/connection'

beforeAll(async () => {
  execSync(
    `docker compose exec postgres sh -c "createdb -h ${process.env.POSTGRES_HOST} -p ${process.env.POSTGRES_PORT} -U ${process.env.POSTGRES_USER} ${process.env.POSTGRES_DB}"`
  )
  execSync('bun run migrate')
})

afterAll(async () => {
  await db.$client.end()

  execSync(
    `docker compose exec postgres sh -c "dropdb -h ${process.env.POSTGRES_HOST} -p ${process.env.POSTGRES_PORT} -U ${process.env.POSTGRES_USER} ${process.env.POSTGRES_DB}"`
  )
})
