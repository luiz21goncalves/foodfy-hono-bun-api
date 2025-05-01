import { ENV } from '@/env'
import { AuthenticationError } from '@/errors'
import { userRepository } from '@/repositories/users-repository'
import { sign } from 'hono/jwt'

type AuthenticateUserData = {
  email: string
  password: string
}

export async function authenticateUser({
  email,
  password,
}: AuthenticateUserData) {
  const user = await userRepository.findByEmail(email)

  if (!user) {
    throw new AuthenticationError()
  }

  const isValidPassword = await Bun.password.verify(password, user.passwordHash)

  if (!isValidPassword) {
    throw new AuthenticationError()
  }

  const token = await sign(
    {
      sub: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * ENV.JWT_EXPIRES_IN_MINUTES,
    },
    ENV.JWT_SECRET
  )

  return { token }
}
