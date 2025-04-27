import { describe, expect, test } from 'bun:test'
import { app } from '@/http/app'

const PATH = '/'
const METHOD = 'GET'

describe(`${METHOD} ${PATH}`, () => {
  describe('Anonymous user', () => {
    test('with non existing route', async () => {
      const response = await app.request(PATH, {
        method: METHOD,
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(404)
      expect(body).toStrictEqual({
        name: 'NotFoundError',
        status_code: 404,
        message: 'Route GET:/ not found.',
      })
    })
  })
})
