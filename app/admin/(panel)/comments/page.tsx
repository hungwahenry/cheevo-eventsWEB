import { CommentsTable } from "@/features/admin/comments/components/comments-table"

export default function AdminCommentsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comments</h1>
        <p className="text-muted-foreground text-sm">
          Cross-event comment moderation. Use Flagged to triage user reports.
        </p>
      </div>
      <CommentsTable />
    </div>
  )
}
