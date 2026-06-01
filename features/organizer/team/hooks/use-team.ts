import {
  addMember,
  listMembers,
  removeMember,
  type Member,
} from "@/features/organizer/team/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const teamQueryKey = (orgId: string) => ["organizer", "team", orgId]

export function useTeam(orgId: string | undefined) {
  return useQuery<Member[]>({
    queryKey: teamQueryKey(orgId ?? ""),
    queryFn: () => listMembers(orgId!),
    enabled: !!orgId,
  })
}

export function useAddMember(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (email: string) => addMember(orgId, email),
    onSuccess: () => {
      toast.success("Team member added.")
      queryClient.invalidateQueries({ queryKey: teamQueryKey(orgId) })
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Could not add member.")
      }
    },
  })
}

export function useRemoveMember(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => removeMember(orgId, userId),
    onSuccess: () => {
      toast.success("Removed from team.")
      queryClient.invalidateQueries({ queryKey: teamQueryKey(orgId) })
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Could not remove member.")
      }
    },
  })
}
