import type { ContentfulStatusCode } from 'hono/utils/http-status'

type ErrorProps<TDetails = unknown> = {
  statusCode: ContentfulStatusCode
  details?: TDetails
}

type ToJson = {
  name: string
  message: string
  status_code: ContentfulStatusCode
  details: unknown
}

type AppProps<TDetails = unknown> = {
  name: string
  message: string
  statusCode: ContentfulStatusCode
  cause?: unknown
  details?: TDetails
}

export class AppError<T = unknown> extends Error {
  private readonly props: ErrorProps<T>

  constructor(props: AppProps<T>) {
    super(props.message, { cause: props.cause })
    this.name = props.name
    this.props = props
  }

  toJSON(): ToJson {
    return {
      name: this.name,
      message: this.message,
      status_code: this.props.statusCode,
      details: this.props.details,
    }
  }
}

type ValidationErrorProps = {
  message: string
  details: unknown
  cause: unknown
}

export class ValidationError extends AppError {
  constructor({ message, details, cause }: ValidationErrorProps) {
    super({
      message,
      details,
      cause,
      name: 'ValidationError',
      statusCode: 400,
    })
  }
}

type InternalServerErrorProps = {
  cause: unknown
}

export class InternalServerError extends AppError {
  constructor({ cause }: InternalServerErrorProps) {
    super({
      message: 'An internal server error occurred.',
      cause,
      name: 'InternalServerError',
      statusCode: 500,
    })
  }
}

type NotFoundErrorProps = {
  cause?: unknown
  message: string
}

export class NotFoundError extends AppError {
  constructor({ message, cause }: NotFoundErrorProps) {
    super({ message, cause, name: 'NotFoundError', statusCode: 404 })
  }
}

type ConflictErrorProps = {
  cause: unknown
  message: string
}

export class ConflictError extends AppError {
  constructor({ message, cause }: ConflictErrorProps) {
    super({
      message,
      cause,
      name: 'ConflictError',
      statusCode: 409,
    })
  }
}
