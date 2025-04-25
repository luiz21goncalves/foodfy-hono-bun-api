import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'

export const app = new Hono()

app.use(requestId())
app.use(pinoLogger())
app.use(cors())
