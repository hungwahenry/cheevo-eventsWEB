import type {
  AllowedCommands,
  OpsHealth,
  QueueStats,
  RunCommandResult,
} from "@/features/admin/ops/types"
import { api } from "@/lib/api"

export function getOpsHealth(): Promise<OpsHealth> {
  return api.get<OpsHealth>("/admin/ops/health")
}

export function getQueueStats(): Promise<QueueStats> {
  return api.get<QueueStats>("/admin/ops/queue-stats")
}

export function getAllowedCommands(): Promise<AllowedCommands> {
  return api.get<AllowedCommands>("/admin/ops/commands")
}

export function runCommand(command: string): Promise<RunCommandResult> {
  return api.post<RunCommandResult>("/admin/ops/run-command", { command })
}
