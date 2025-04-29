import { randomBytes } from 'node:crypto'
import { ConflictError } from '@/errors'
import { userRepository } from '@/repositories/users-repository'

type CreateUserData = {
  name: string
  email: string
  role: 'admin' | 'writer'
}

export async function createUser({ email, name, role }: CreateUserData) {
  const foundUserByEmail = await userRepository.findByEmail(email)

  if (foundUserByEmail) {
    throw new ConflictError({
      cause: foundUserByEmail,
      message: `There is a user with same identifier ${email}`,
    })
  }

  const password = randomBytes(6).toBase64()
  const passwordHash = await Bun.password.hash(password)

  const user = await userRepository.save({
    id: Bun.randomUUIDv7(),
    name,
    role,
    email,
    passwordHash,
  })

  return { user }
}
