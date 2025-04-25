import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { requestId } from 'hono/request-id'

import { InternalServerError, NotFoundError } from '../errors'

export const app = new Hono()

app.use(requestId())
app.use(pinoLogger())
app.use(cors())

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
