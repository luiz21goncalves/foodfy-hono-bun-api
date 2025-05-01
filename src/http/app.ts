import { ENV } from '@/env'
import { AppError, InternalServerError, NotFoundError } from '@/errors'
import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
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

app.notFound((c) => {
  const { path, method } = c.req

  const notFountError = new NotFoundError({
    message: `Route ${method}:${path} not found.`,
  }).toJSON()

  return c.json(notFountError, notFountError.status_code)
})

app.onError((err, c) => {
  if (err instanceof AppError) {
    const errorObject = err.toJSON()

    return c.json(errorObject, errorObject.status_code)
  }

  const internalServerError = new InternalServerError({ cause: err }).toJSON()

  return c.json(internalServerError, internalServerError.status_code)
})

app.route('/v1', routes)
