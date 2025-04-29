import { describe, expect, test } from 'bun:test'
import { app } from '@/http/app'
import { userRepository } from '@/repositories/users-repository'
import { faker } from '@faker-js/faker'

const PATH = '/v1/users'
const METHOD = 'POST'

describe(`${METHOD} ${PATH}`, () => {
  describe('Anonymous user', () => {
    test('with empty body', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message:
          'Validation error: Required at "name"; Required at "email"; Required at "role"',
        details: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['name'],
            message: 'Required',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['email'],
            message: 'Required',
          },
          {
            expected: "'admin' | 'writer'",
            received: 'undefined',
            code: 'invalid_type',
            path: ['role'],
            message: 'Required',
          },
        ],
      })
    })

    test('with invalid "name"', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({
          name: '',
          role: faker.helpers.arrayElement(['admin', 'writer']),
          email: faker.internet.email(),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message:
          'Validation error: String must contain at least 2 character(s) at "name"',
        details: [
          {
            code: 'too_small',
            exact: false,
            inclusive: true,
            message: 'String must contain at least 2 character(s)',
            minimum: 2,
            type: 'string',
            path: ['name'],
          },
        ],
      })
    })

    test('with invalid "email"', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ name: 'FooBar', role: 'admin', email: '' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'Validation error: Invalid email at "email"',
        details: [
          {
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
            validation: 'email',
          },
        ],
      })
    })

    test('with invalid "role"', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({
          name: faker.person.fullName(),
          role: '',
          email: faker.internet.email(),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message:
          "Validation error: Invalid enum value. Expected 'admin' | 'writer', received '' at \"role\"",
        details: [
          {
            code: 'invalid_enum_value',
            message:
              "Invalid enum value. Expected 'admin' | 'writer', received ''",
            options: ['admin', 'writer'],
            path: ['role'],
            received: '',
          },
        ],
      })
    })

    test('with duplicated email', async () => {
      const duplicatedEmail = faker.internet.email()

      await userRepository.save({
        email: duplicatedEmail.toLowerCase(),
        id: Bun.randomUUIDv7(),
        name: faker.person.fullName(),
        role: 'writer',
        passwordHash: faker.internet.password(),
      })

      const name = faker.person.fullName()
      const role = faker.helpers.arrayElement(['admin', 'writer'])

      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ name, role, email: duplicatedEmail }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(409)
      expect(body).toStrictEqual({
        message: `There is a user with same identifier ${duplicatedEmail.toLowerCase()}`,
        name: 'ConflictError',
        status_code: 409,
      })
    })

    test('with valid data', async () => {
      const name = faker.person.fullName()
      const role = faker.helpers.arrayElement(['admin', 'writer'])
      const email = faker.internet.email()

      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ name, role, email }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(201)
      expect(body).toStrictEqual({
        user: {
          id: expect.any(String),
          name,
          role,
          email: email.toLowerCase(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })
})
