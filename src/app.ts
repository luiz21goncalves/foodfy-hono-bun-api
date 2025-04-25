import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { requestId } from 'hono/request-id'

export const app = new Hono()

app.use(requestId())
app.use(pinoLogger())
