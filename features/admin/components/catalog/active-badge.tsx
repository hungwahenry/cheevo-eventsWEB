import { Badge } from "@/components/ui/badge"

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="outline">Inactive</Badge>
  )
}
