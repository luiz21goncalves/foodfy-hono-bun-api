import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const userEnumRole = pgEnum('user_role', ['admin', 'writer'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  role: userEnumRole('role').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})
