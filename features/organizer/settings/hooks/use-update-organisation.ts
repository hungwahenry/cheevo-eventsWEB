import { meQueryKey } from "@/features/auth/hooks/use-me"
import {
  updateOrganisation,
  type OrganisationUpdate,
} from "@/features/organizer/settings/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateOrganisation(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (update: OrganisationUpdate) =>
      updateOrganisation(orgId, update),
    onSuccess: () => {
      toast.success("Saved.")
      queryClient.invalidateQueries({ queryKey: meQueryKey })
    },
    onError: (error) => {
      if (isApiError(error) && error.isValidation) {
        const first = Object.values(error.fieldErrors())[0]
        toast.error(first ?? error.message)
      } else if (isApiError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Could not save changes.")
      }
    },
  })
}
