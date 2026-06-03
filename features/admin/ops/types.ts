export type OpsHealth = {
  queue: {
    pending: number
    failed: number
    oldest_pending_seconds: number | null
  }
  storage: { disk: string; healthy: boolean }
  db: { connection: string; healthy: boolean }
  cache: { store: string; healthy: boolean }
}

export type QueueStats = {
  pending: number
  failed: number
  by_queue: Record<string, number>
}

export type AllowedCommands = {
  commands: string[]
}

export type RunCommandResult = {
  command: string
  exit_code: number
  output: string
}
