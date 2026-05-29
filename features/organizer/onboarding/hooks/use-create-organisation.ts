import { meQueryKey } from "@/features/auth"
import * as orgApi from "@/features/organizer/onboarding/api"
import { useOrganizerOnboardingStore } from "@/features/organizer/onboarding/stores"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useCreateOrganisation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      orgApi.createOrganisation(useOrganizerOnboardingStore.getState().draft),
    onSuccess: async () => {
      toast.success("Your organisation is live.")
      useOrganizerOnboardingStore.getState().reset()
      await queryClient.invalidateQueries({ queryKey: meQueryKey })
      router.replace("/organizer")
    },
  })
}
