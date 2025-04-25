import { describe, expect, test } from 'bun:test'
import { app } from '../../src/http/app'

const PATH = '/'

describe(`GET ${PATH}`, () => {
  test('Anonymous user', () => {
    test('with non existing route', async () => {
      const response = await app.request(PATH)
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body).toStrictEqual({
        name: 'NotFoundError',
        status_code: 404,
        message: 'Route GET:/ not found.',
      })
    })
  })
})
