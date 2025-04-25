import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'

export const app = new Hono()

app.use(pinoLogger())
