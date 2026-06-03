import type { SearchHealth } from "@/features/admin/search/types"
import { api } from "@/lib/api"

export function getSearchHealth(): Promise<SearchHealth> {
  return api.get<SearchHealth>("/admin/search/health")
}

export function reindexSearch(): Promise<{ queued: boolean }> {
  return api.post<{ queued: boolean }>("/admin/search/reindex")
}
