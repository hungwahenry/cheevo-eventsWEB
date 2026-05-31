"use client"

import { Button } from "@/components/ui/button"
import { TicketCard } from "@/features/organizer/events/tickets/components/ticket-card"
import { TicketFormDialog } from "@/features/organizer/events/tickets/components/ticket-form-dialog"
import { useTickets } from "@/features/organizer/events/tickets/hooks"
import type { EventTicket } from "@/features/organizer/events/tickets/types"
import type { EventItem } from "@/features/organizer/events/types"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { PlusIcon, TicketIcon } from "lucide-react"
import { useState } from "react"

export function TicketsSection({ event }: { event: EventItem }) {
  const tickets = useTickets(event.id, event.tickets ?? [])
  const [editing, setEditing] = useState<EventTicket | null>(null)
  const [open, setOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const openEdit = (ticket: EventTicket) => {
    setEditing(ticket)
    setOpen(true)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Tickets</h2>
        <Button type="button" variant="outline" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Add ticket
        </Button>
      </div>

      {tickets.items.length === 0 ? (
        <button
          type="button"
          onClick={openCreate}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-10 text-sm text-muted-foreground transition hover:bg-muted/40"
        >
          <TicketIcon className="size-5" />
          <span>Create a ticket to start selling</span>
        </button>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={tickets.onDragEnd}
        >
          <SortableContext
            items={tickets.items.map((ticket) => ticket.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {tickets.items.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  currency={event.currency}
                  onEdit={openEdit}
                  onDelete={tickets.deleteTicket}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <TicketFormDialog
        eventId={event.id}
        ticket={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  )
}
