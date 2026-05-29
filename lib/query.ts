import { isApiError } from "@/lib/api/errors"
import { MutationCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    // Global mutation feedback: surface failures as toasts — except validation
    // (422), which features render inline on the form.
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isApiError(error) && error.isValidation) return
        toast.error(
          isApiError(error)
            ? error.message
            : "Something went wrong. Please try again."
        )
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (isApiError(error) && error.status >= 400 && error.status < 500) {
            return false
          }
          return failureCount < 2
        },
        staleTime: 30_000,
        gcTime: 5 * 60_000,
      },
    },
  })
}
