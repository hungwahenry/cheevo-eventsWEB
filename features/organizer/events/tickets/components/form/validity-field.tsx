"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function ValidityField({ form }: { form: TicketForm }) {
  return (
    <SettingsBlock
      title="Ticket validity"
      description="When this ticket actually grants entry."
      enabled={form.toggles.validity}
      onToggle={(v) => form.toggle("validity", v)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ticket-valid-from">From</Label>
          <Input
            id="ticket-valid-from"
            type="datetime-local"
            value={form.form.valid_from}
            onChange={(e) => form.set("valid_from", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ticket-valid-to">To</Label>
          <Input
            id="ticket-valid-to"
            type="datetime-local"
            value={form.form.valid_to}
            onChange={(e) => form.set("valid_to", e.target.value)}
          />
        </div>
      </div>
    </SettingsBlock>
  )
}
