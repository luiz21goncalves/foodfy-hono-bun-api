import { ValidationError } from '@/errors'
import { zValidator as zv } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import type { ZodSchema } from 'zod'
import { fromError } from 'zod-validation-error'

export const zValidator = <
  SchemaType extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: SchemaType
) => {
  return zv(target, schema, (result, _c) => {
    if (!result.success) {
      const validationError = fromError(result.error)

      throw new ValidationError({
        cause: validationError,
        details: validationError.details,
        message: validationError.message,
      })
    }
  })
}
