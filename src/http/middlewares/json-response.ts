import { createMiddleware } from 'hono/factory'

export const jsonResponse = createMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('Content-Type', 'application/json')
})
