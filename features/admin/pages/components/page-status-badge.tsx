import { Badge } from "@/components/ui/badge"

export function PageStatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge variant="default">Published</Badge>
  ) : (
    <Badge variant="outline">Draft</Badge>
  )
}
