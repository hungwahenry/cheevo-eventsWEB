"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { IssuedTicketStatusBadge } from "@/features/organizer/events/issued-tickets/components/issued-ticket-status-badge"
import {
  useIssuedTicket,
  useRevokeIssuedTicket,
} from "@/features/organizer/events/issued-tickets/hooks"
import { formatMoney } from "@/lib/format/money"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import QRCode from "react-qr-code"

type Props = { eventId: string; ticketId: string }

export function IssuedTicketDetail({ eventId, ticketId }: Props) {
  const { data: ticket, isLoading } = useIssuedTicket(eventId, ticketId)
  const revoke = useRevokeIssuedTicket(eventId, ticketId)

  if (isLoading || !ticket) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  const holderName =
    ticket.holder.display_name ??
    ticket.holder.username ??
    ticket.holder.email ??
    "—"
  const initials = holderName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const dimmed = ticket.status !== "valid"
  const otherCount = ticket.holder_event_tickets_count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/organizer/events/${eventId}`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start text-sm">
        <ArrowLeftIcon className="size-4" />
        Back to event
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{ticket.ticket_name}</h1>
          <IssuedTicketStatusBadge status={ticket.status} />
        </div>
        <p className="text-muted-foreground font-mono text-sm">{ticket.code}</p>
      </div>

      <section className="flex flex-col items-center gap-3 rounded-xl bg-card p-6">
        <div
          className="rounded-xl bg-white p-3"
          style={{ opacity: dimmed ? 0.35 : 1 }}>
          <QRCode value={ticket.code} size={180} />
        </div>
        <p className="text-muted-foreground text-xs">
          Cross-check against the holder&apos;s phone at the door.
        </p>
      </section>

      <section className="rounded-xl bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Holder</h2>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {ticket.holder.avatar_url ? (
              <AvatarImage src={ticket.holder.avatar_url} alt="" />
            ) : null}
            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{holderName}</p>
            {ticket.holder.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {ticket.holder.email}
              </p>
            ) : null}
          </div>
        </div>
        {otherCount > 0 ? (
          <p className="text-muted-foreground mt-4 text-xs">
            Holds {otherCount} other ticket{otherCount === 1 ? "" : "s"} for
            this event.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Activity</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <Row
            label="Issued"
            value={new Date(ticket.created_at).toLocaleString()}
          />
          <Row
            label="Order"
            value={
              <Link
                href={`/organizer/events/${eventId}/orders/${ticket.order_id}`}
                className="underline-offset-2 hover:underline">
                #{ticket.order_id.slice(-8)}
              </Link>
            }
          />
          {ticket.order ? (
            <>
              <Row
                label="Paid"
                value={formatMoney(
                  ticket.order.total_minor,
                  ticket.order.currency
                )}
              />
              {ticket.order.paid_at ? (
                <Row
                  label="Paid at"
                  value={new Date(ticket.order.paid_at).toLocaleString()}
                />
              ) : null}
            </>
          ) : null}
          {ticket.scanned_at ? (
            <>
              <Row
                label="Scanned at"
                value={new Date(ticket.scanned_at).toLocaleString()}
              />
              {ticket.scanned_by ? (
                <Row
                  label="Scanned by"
                  value={
                    ticket.scanned_by.display_name ??
                    ticket.scanned_by.email ??
                    "—"
                  }
                />
              ) : null}
            </>
          ) : null}
        </dl>
      </section>

      {ticket.status !== "revoked" ? (
        <section className="rounded-xl bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold">Danger zone</h2>
          <p className="text-muted-foreground mb-4 text-xs">
            Revoking marks this ticket invalid at the door. The holder will see
            it greyed out and won&apos;t be admitted.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Revoke ticket
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke this ticket?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. The holder won&apos;t be admitted
                  with this code.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate()}>
                  {revoke.isPending ? "Revoking…" : "Revoke"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      ) : null}
    </div>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}
