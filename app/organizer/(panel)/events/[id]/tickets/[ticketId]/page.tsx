"use client"

import { IssuedTicketDetail } from "@/features/organizer/events/issued-tickets/components/issued-ticket-detail"
import { useParams } from "next/navigation"

export default function IssuedTicketPage() {
  const { id, ticketId } = useParams<{ id: string; ticketId: string }>()
  return <IssuedTicketDetail eventId={id} ticketId={ticketId} />
}
