import * as api from "@/features/admin/broadcasts/api"
import { broadcastKey } from "@/features/admin/broadcasts/hooks/use-broadcasts"
import type { AdminBroadcast } from "@/features/admin/broadcasts/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCancelBroadcast() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.cancelBroadcast(id),
    onSuccess: (data: AdminBroadcast) => {
      toast.success("Broadcast cancelled.")
      qc.invalidateQueries({ queryKey: ["admin", "broadcasts"] })
      qc.invalidateQueries({ queryKey: broadcastKey(data.id) })
    },
    onError: (error: unknown) => {
      toast.error(
        isApiError(error) ? error.message : "Couldn't cancel the broadcast."
      )
    },
  })
}
