export type ApiSuccess<T> = {
  status: "success"
  message: string
  data: T
  meta?: Record<string, unknown>
}

export type ApiErrorBody = {
  status: "error"
  message: string
  code?: string
  errors?: Record<string, string[]>
  request_id?: string
}
