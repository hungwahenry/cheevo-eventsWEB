"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { EventStatusBadge } from "@/features/admin/events/components/event-status-badge"
import {
  useDeleteEvent,
  useEvent,
  useLockEventComments,
  useMarkEventPast,
  useUnlockEventComments,
  useUnpublishEvent,
} from "@/features/admin/events/hooks"
import { formatMoney } from "@/lib/format/money"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function EventDetail({ id }: { id: string }) {
  const router = useRouter()
  const { data: event, isLoading } = useEvent(id)
  const unpublish = useUnpublishEvent()
  const markPast = useMarkEventPast()
  const lock = useLockEventComments()
  const unlock = useUnlockEventComments()
  const del = useDeleteEvent()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [lockOpen, setLockOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!event) {
    return <div className="p-6 text-sm">Event not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/events"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Events
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {event.organisation?.name ?? "—"}
            {event.city ? ` · ${event.city}` : ""}
          </p>
        </div>
        <EventStatusBadge status={event.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <Field
                label="Starts"
                value={
                  event.starts_at
                    ? new Date(event.starts_at).toLocaleString()
                    : "—"
                }
              />
              <Field
                label="Ends"
                value={
                  event.ends_at ? new Date(event.ends_at).toLocaleString() : "—"
                }
              />
              <Field label="Venue" value={event.venue_name} />
              <Field
                label="Published"
                value={
                  event.published_at
                    ? new Date(event.published_at).toLocaleString()
                    : "—"
                }
              />
              <Field label="Slug" value={event.slug} mono />
              <Field
                label="Created"
                value={
                  event.created_at
                    ? new Date(event.created_at).toLocaleDateString()
                    : "—"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales & engagement</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <Field
                label="Tickets sold"
                value={`${event.tickets_sold} / ${event.tickets_count}`}
              />
              <Field
                label="Revenue"
                value={formatMoney(event.revenue_minor, event.currency ?? "NGN")}
              />
              <Field label="RSVPs" value={String(event.rsvps_count)} />
              <Field label="Comments" value={String(event.comments_count)} />
              <Field
                label="Comments locked"
                value={
                  event.comments_locked_at
                    ? new Date(event.comments_locked_at).toLocaleString()
                    : "—"
                }
              />
            </CardContent>
          </Card>

          {event.suspended_reason ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suspension reason</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {event.suspended_reason}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {event.status === "published" ? (
              <Button
                variant="outline"
                onClick={() => unpublish.mutate(event.id)}
                disabled={unpublish.isPending}
              >
                Unpublish
              </Button>
            ) : null}
            {event.status !== "past" ? (
              <Button
                variant="outline"
                onClick={() => markPast.mutate(event.id)}
                disabled={markPast.isPending}
              >
                Mark past
              </Button>
            ) : null}
            {event.comments_locked_at ? (
              <Button
                variant="secondary"
                onClick={() => unlock.mutate(event.id)}
                disabled={unlock.isPending}
              >
                Unlock comments
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setLockOpen(true)}
                disabled={lock.isPending}
              >
                Lock comments…
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              disabled={del.isPending}
            >
              Delete…
            </Button>
          </CardContent>
        </Card>
      </div>

      <ReasonDialog
        open={lockOpen}
        onOpenChange={setLockOpen}
        title="Lock comments?"
        description="New comments will be refused. Existing comments stay visible."
        confirmLabel="Lock"
        isSubmitting={lock.isPending}
        onConfirm={(reason) =>
          lock.mutate(
            { id: event.id, reason },
            { onSuccess: () => setLockOpen(false) }
          )
        }
      />

      <ReasonDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete event?"
        description="Hard-deletes the event and cascades to tickets, orders, comments. This cannot be undone."
        confirmLabel="Delete"
        destructive
        isSubmitting={del.isPending}
        onConfirm={(reason) =>
          del.mutate(
            { id: event.id, reason },
            {
              onSuccess: () => {
                setDeleteOpen(false)
                router.push("/admin/events")
              },
            }
          )
        }
      />
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value ?? "—"}</span>
    </div>
  )
}
