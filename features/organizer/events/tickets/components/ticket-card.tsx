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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTicketStatus } from "@/features/organizer/events/tickets/format"
import type { EventTicket } from "@/features/organizer/events/tickets/types"
import { formatMoney } from "@/lib/format/money"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react"

type TicketCardProps = {
  ticket: EventTicket
  currency: string
  onEdit: (ticket: EventTicket) => void
  onDelete: (id: string) => void
}

export function TicketCard({ ticket, currency, onEdit, onDelete }: TicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const showCompare =
    ticket.display_price !== null && ticket.display_price > ticket.gross_price

  const availability =
    ticket.quantity === null ? "Unlimited" : `${ticket.quantity} available`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-xl border bg-card p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{ticket.name}</p>
          <Badge
            variant={ticket.status === "on_sale" ? "default" : "secondary"}
          >
            {formatTicketStatus(ticket.status)}
          </Badge>
        </div>
        {ticket.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {ticket.description}
          </p>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold">
            {formatMoney(ticket.gross_price, currency)}
          </span>
          {showCompare ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatMoney(ticket.display_price as number, currency)}
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">
            · {availability}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Edit"
          onClick={() => onEdit(ticket)}
        >
          <PencilIcon className="size-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this ticket?</AlertDialogTitle>
              <AlertDialogDescription>
                "{ticket.name}" will be removed from the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(ticket.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
