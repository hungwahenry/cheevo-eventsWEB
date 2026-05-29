import {
  useDeleteTicket,
  useReorderTickets,
} from "@/features/organizer/events/tickets/hooks/use-ticket-mutations"
import type { EventTicket } from "@/features/organizer/events/tickets/types"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

export function useTickets(eventId: string, initial: EventTicket[]) {
  const remove = useDeleteTicket(eventId)
  const reorder = useReorderTickets(eventId)

  const [items, setItems] = useState<EventTicket[]>(initial)

  useEffect(() => {
    setItems(initial)
  }, [initial])

  const deleteTicket = (id: string) => {
    setItems((prev) => prev.filter((ticket) => ticket.id !== id))
    remove.mutate(id)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((ticket) => ticket.id === active.id)
    const newIndex = items.findIndex((ticket) => ticket.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)
    reorder.mutate(next.map((ticket) => ticket.id))
  }

  return {
    items,
    deleteTicket,
    onDragEnd,
  }
}
