import { describe, expect, test } from 'bun:test'
import { app } from '@/http/app'
import { userRepository } from '@/repositories/users-repository'
import { faker } from '@faker-js/faker'
import { userFactory } from 'tests/factories/user-factory'

const PATH = '/v1/auth/login'
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
          'Validation error: Required at "email"; Required at "password"',
        details: [
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['email'],
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['password'],
            received: 'undefined',
          },
        ],
      })
    })

    test('with invalid "password"', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ email: faker.internet.email() }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'Validation error: Required at "password"',
        details: [
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['password'],
            received: 'undefined',
          },
        ],
      })
    })

    test('with invalid "email"', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ password: faker.internet.password() }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'Validation error: Required at "email"',
        details: [
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['email'],
            received: 'undefined',
          },
        ],
      })
    })

    test('with wrong "email"', async () => {
      const password = faker.internet.password()
      const userData = await userFactory({
        passwordHash: await Bun.password.hash(password),
      })
      await userRepository.save(userData)

      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ password, email: faker.internet.email() }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        message: 'Invalid password or email.',
        name: 'AuthenticationError',
        status_code: 400,
      })
    })

    test('with wrong "password"', async () => {
      const email = faker.internet.email()
      const userData = await userFactory({
        email: email.toLowerCase(),
      })
      await userRepository.save(userData)

      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ password: 'pass-123', email }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        message: 'Invalid password or email.',
        name: 'AuthenticationError',
        status_code: 400,
      })
    })

    test('with valid data', async () => {
      const password = faker.internet.email()
      const userData = await userFactory({
        passwordHash: await Bun.password.hash(password),
      })
      await userRepository.save(userData)

      const response = await app.request(PATH, {
        method: METHOD,
        body: JSON.stringify({ password: password, email: userData.email }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(200)
      expect(body).toStrictEqual({ token: expect.any(String) })
    })
  })
})
