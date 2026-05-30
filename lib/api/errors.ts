export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly errors?: Record<string, string[]>
  readonly requestId?: string

  constructor(params: {
    message: string
    status: number
    code?: string
    errors?: Record<string, string[]>
    requestId?: string
  }) {
    super(params.message)
    this.name = "ApiError"
    this.status = params.status
    this.code = params.code
    this.errors = params.errors
    this.requestId = params.requestId
  }

  /** 422 — field validation failed; show these inline on the form, not in a toast. */
  get isValidation(): boolean {
    return this.status === 422
  }

  fieldErrors(): Record<string, string> {
    if (!this.errors) return {}
    return Object.fromEntries(
      Object.entries(this.errors).map(([field, messages]) => [
        field,
        messages[0],
      ])
    )
  }

  messages(): string[] {
    if (this.isValidation) {
      const field = Object.values(this.fieldErrors())
      if (field.length > 0) return field
    }
    return [this.message]
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
