import { createUser } from '@/use-cases/create-user'
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '../middlewares/validator'

export const userRoutes = new Hono()

userRoutes.post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z.string().min(2),
      email: z.string().email().toLowerCase(),
      role: z.enum(['admin', 'writer']),
    })
  ),
  async (c) => {
    const { logger, requestId } = c.var

    const { name, role, email } = c.req.valid('json')
    logger.debug({ requestId, body: { name, role, email } })

    const { user } = await createUser({ email, name, role })
    logger.debug({ requestId, user })

    return c.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      },
      201
    )
  }
)
