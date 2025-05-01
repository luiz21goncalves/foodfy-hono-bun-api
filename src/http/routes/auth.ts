import { authenticateUser } from '@/use-cases/authenticate-user'
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '../middlewares/validator'

export const authRoutes = new Hono()

authRoutes.post(
  '/login',
  zValidator(
    'json',
    z.object({
      email: z.string().email().toLowerCase(),
      password: z.string(),
    })
  ),
  async (c) => {
    const { logger, requestId } = c.var

    const { email, password } = c.req.valid('json')
    logger.debug({ requestId, body: { email, password } })

    const { token } = await authenticateUser({ email, password })
    logger.debug({ requestId, token })

    return c.json({ token }, 200)
  }
)
