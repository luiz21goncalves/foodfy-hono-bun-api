import { ENV } from '@/env'
import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { requestId } from 'hono/request-id'
import { InternalServerError, NotFoundError } from '../errors'
import { jsonResponse } from './middlewares/json-response'
import { routes } from './routes'

export const app = new Hono()

app.use(requestId())
app.use(
  pinoLogger({
    pino: {
      level: ENV.LOGGER_LEVEL,
    },
  })
)
app.use(cors())
app.use(jsonResponse)

app.notFound((c) => {
  const { path, method } = c.req

  const notFountError = new NotFoundError({
    message: `Route ${method}:${path} not found.`,
  })

  return notFountError.getResponse()
})

app.onError((err, _c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  const internalServerError = new InternalServerError(err)

  return internalServerError.getResponse()
})

app.route('/v1', routes)
