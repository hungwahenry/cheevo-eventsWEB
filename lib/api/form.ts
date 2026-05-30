import { isApiError } from "@/lib/api/errors"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"

export function applyApiErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown
): boolean {
  if (!isApiError(error) || !error.isValidation) return false
  for (const [field, message] of Object.entries(error.fieldErrors())) {
    form.setError(field as Path<T>, { type: "server", message })
  }
  return true
}
