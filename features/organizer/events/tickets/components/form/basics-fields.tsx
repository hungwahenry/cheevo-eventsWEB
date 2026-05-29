"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function BasicsFields({ form }: { form: TicketForm }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-name">Name</Label>
        <Input
          id="ticket-name"
          value={form.form.name}
          onChange={(e) => form.set("name", e.target.value)}
          placeholder="e.g. Early Bird"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-description">Description</Label>
        <Textarea
          id="ticket-description"
          rows={3}
          value={form.form.description}
          onChange={(e) => form.set("description", e.target.value)}
          placeholder="What's included with this ticket?"
        />
      </div>
    </>
  )
}
