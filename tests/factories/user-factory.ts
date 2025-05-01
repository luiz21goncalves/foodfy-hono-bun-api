import type { users } from '@/db/schema'
import { faker } from '@faker-js/faker'

export async function userFactory(
  override?: Partial<typeof users.$inferInsert>
): Promise<typeof users.$inferSelect> {
  return {
    id: Bun.randomUUIDv7(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    passwordHash: await Bun.password.hash(faker.internet.password()),
    role: faker.helpers.arrayElement(['writer', 'admin']),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  }
}
