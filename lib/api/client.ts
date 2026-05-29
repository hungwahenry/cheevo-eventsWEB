import { ApiError } from "@/lib/api/errors"
import type { ApiErrorBody, ApiSuccess } from "@/lib/api/types"
import axios, { type AxiosError, type AxiosRequestConfig } from "axios"

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

const instance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { Accept: "application/json" },
  withCredentials: true,
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const apiError = normalizeError(error)
    if (apiError.status === 401) {
      onUnauthorized?.()
    }
    return Promise.reject(apiError)
  }
)

function normalizeError(error: AxiosError<ApiErrorBody>): ApiError {
  if (error.response) {
    const body = error.response.data
    return new ApiError({
      message: body?.message ?? "Something went wrong.",
      status: error.response.status,
      code: body?.code,
      errors: body?.errors,
      requestId: body?.request_id,
    })
  }
  if (error.request) {
    return new ApiError({
      message: "Network error. Please check your connection.",
      status: 0,
      code: "network_error",
    })
  }
  return new ApiError({
    message: error.message || "Unexpected error.",
    status: 0,
    code: "unknown",
  })
}

async function request<T>(cfg: AxiosRequestConfig): Promise<T> {
  const response = await instance.request<ApiSuccess<T>>(cfg)
  return response.data.data
}

export const api = {
  get: <T>(url: string, cfg?: AxiosRequestConfig) =>
    request<T>({ ...cfg, method: "GET", url }),
  post: <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) =>
    request<T>({ ...cfg, method: "POST", url, data }),
  put: <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) =>
    request<T>({ ...cfg, method: "PUT", url, data }),
  patch: <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) =>
    request<T>({ ...cfg, method: "PATCH", url, data }),
  delete: <T>(url: string, cfg?: AxiosRequestConfig) =>
    request<T>({ ...cfg, method: "DELETE", url }),
}
