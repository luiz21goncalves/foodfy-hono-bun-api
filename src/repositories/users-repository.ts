import { db } from '@/db/connection'
import { users } from '@/db/schema'

export const userRepository = {
  save: async (data: typeof users.$inferInsert) => {
    const [user] = await db.insert(users).values(data).returning()

    return user
  },
  findByEmail: async (email: string) => {
    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    return user
  },
}
