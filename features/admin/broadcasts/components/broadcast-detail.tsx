"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BroadcastStatusBadge } from "@/features/admin/broadcasts/components/broadcast-status-badge"
import {
  useBroadcast,
  useCancelBroadcast,
} from "@/features/admin/broadcasts/hooks"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

export function BroadcastDetail({ id }: { id: string }) {
  const { data: broadcast, isLoading } = useBroadcast(id)
  const cancel = useCancelBroadcast()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!broadcast) {
    return <div className="p-6 text-sm">Broadcast not found.</div>
  }

  const isCancellable =
    broadcast.status === "queued" || broadcast.status === "sending"

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/broadcasts"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Broadcasts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {broadcast.subject}
          </h1>
          <p className="text-muted-foreground text-sm">
            {broadcast.organisation?.name ?? "—"}
            {broadcast.event ? ` · ${broadcast.event.title}` : ""}
          </p>
        </div>
        <BroadcastStatusBadge status={broadcast.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <Field
                label="Recipients"
                value={String(broadcast.recipients_count)}
              />
              <Field label="Sent" value={String(broadcast.sent_count)} />
              <Field label="Failed" value={String(broadcast.failed_count)} />
              <Field label="Audience" value={broadcast.audience} />
              <Field
                label="Sent at"
                value={
                  broadcast.sent_at
                    ? new Date(broadcast.sent_at).toLocaleString()
                    : "—"
                }
              />
              <Field
                label="Created"
                value={
                  broadcast.created_at
                    ? new Date(broadcast.created_at).toLocaleString()
                    : "—"
                }
              />
            </CardContent>
          </Card>

          {broadcast.body_html ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Body</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: broadcast.body_html }}
                />
              </CardContent>
            </Card>
          ) : null}

          {broadcast.failure_reason ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Failure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {broadcast.failure_reason}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {isCancellable ? (
              <Button
                variant="destructive"
                onClick={() => cancel.mutate(broadcast.id)}
                disabled={cancel.isPending}
              >
                Cancel send
              </Button>
            ) : (
              <p className="text-muted-foreground text-xs">
                No actions for {broadcast.status} broadcasts.
              </p>
            )}
            {broadcast.created_by ? (
              <div className="border-t pt-3 text-xs">
                <div className="text-muted-foreground">Created by</div>
                <div className="font-medium">{broadcast.created_by.email}</div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span>{value ?? "—"}</span>
    </div>
  )
}
