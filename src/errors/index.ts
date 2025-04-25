import { HTTPException } from 'hono/http-exception'
import type { ValidationError as ZodValidationError } from 'zod-validation-error'

export class ValidationError extends HTTPException {
  constructor(error: ZodValidationError) {
    super(400, {
      message: JSON.stringify({
        name: 'ValidationError',
        status_code: 400,
        message: error.message,
        details: error.details,
      }),
      cause: error,
    })
  }
}

export class InternalServerError extends HTTPException {
  constructor(cause?: unknown) {
    super(500, {
      message: JSON.stringify({
        name: 'InternalServerError',
        status_code: 500,
        message: 'An internal server error occurred.',
      }),
    })
  }
}

export class NotFoundError extends HTTPException {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(404, {
      message: JSON.stringify({
        name: 'NotFoundError',
        status_code: 404,
        message,
      }),
      cause,
    })
  }
}
