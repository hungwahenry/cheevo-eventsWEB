"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"
import type { TicketStatus } from "@/features/organizer/events/tickets/types"

export function StatusField({ form }: { form: TicketForm }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="ticket-status">Status</Label>
      <Select
        value={form.form.status}
        onValueChange={(v) => form.set("status", v as TicketStatus)}
      >
        <SelectTrigger id="ticket-status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="on_sale">On sale</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
