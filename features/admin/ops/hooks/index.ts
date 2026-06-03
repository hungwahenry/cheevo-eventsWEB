import * as api from "@/features/admin/ops/api"
import type { RunCommandResult } from "@/features/admin/ops/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const opsHealthKey = () => ["admin", "ops-health"] as const
export const queueStatsKey = () => ["admin", "queue-stats"] as const
export const allowedCommandsKey = () => ["admin", "ops-commands"] as const

export function useOpsHealth() {
  return useQuery({
    queryKey: opsHealthKey(),
    queryFn: () => api.getOpsHealth(),
    staleTime: 5_000,
    refetchInterval: 10_000,
  })
}

export function useQueueStats() {
  return useQuery({
    queryKey: queueStatsKey(),
    queryFn: () => api.getQueueStats(),
    staleTime: 5_000,
    refetchInterval: 10_000,
  })
}

export function useAllowedCommands() {
  return useQuery({
    queryKey: allowedCommandsKey(),
    queryFn: () => api.getAllowedCommands(),
    staleTime: 60_000,
  })
}

export function useRunCommand() {
  return useMutation({
    mutationFn: (command: string) => api.runCommand(command),
    onSuccess: (result: RunCommandResult) => {
      toast.success(
        `${result.command} exited ${result.exit_code === 0 ? "OK" : `with code ${result.exit_code}`}.`
      )
    },
    onError: (error: unknown) => {
      toast.error(isApiError(error) ? error.message : "Command failed.")
    },
  })
}
