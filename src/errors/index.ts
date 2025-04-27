import { HTTPException } from 'hono/http-exception'
import type { ValidationError as ZodValidationError } from 'zod-validation-error'

export class ValidationError extends HTTPException {
  constructor(error: ZodValidationError) {
    const statusCode = 400

    super(statusCode, {
      message: JSON.stringify({
        name: 'ValidationError',
        status_code: statusCode,
        message: error.message,
        details: error.details,
      }),
      cause: error,
    })
  }
}

export class InternalServerError extends HTTPException {
  constructor(cause?: unknown) {
    const statusCode = 500

    super(statusCode, {
      message: JSON.stringify({
        name: 'InternalServerError',
        status_code: statusCode,
        message: 'An internal server error occurred.',
      }),
      cause,
    })
  }
}

export class NotFoundError extends HTTPException {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    const statusCode = 404

    super(statusCode, {
      message: JSON.stringify({
        name: 'NotFoundError',
        status_code: statusCode,
        message,
      }),
      cause,
    })
  }
}

export class ConflictError extends HTTPException {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    const statusCode = 409

    super(statusCode, {
      message: JSON.stringify({
        name: 'ConflictError',
        status_code: statusCode,
        message,
      }),
      cause,
    })
  }
}
