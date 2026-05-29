"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function SalesWindowField({ form }: { form: TicketForm }) {
  return (
    <SettingsBlock
      title="Sales period"
      description="Limit when this ticket can be bought."
      enabled={form.toggles.salesWindow}
      onToggle={(v) => form.toggle("salesWindow", v)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ticket-sales-from">From</Label>
          <Input
            id="ticket-sales-from"
            type="datetime-local"
            value={form.form.sales_starts_at}
            onChange={(e) => form.set("sales_starts_at", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ticket-sales-to">To</Label>
          <Input
            id="ticket-sales-to"
            type="datetime-local"
            value={form.form.sales_ends_at}
            onChange={(e) => form.set("sales_ends_at", e.target.value)}
          />
        </div>
      </div>
    </SettingsBlock>
  )
}
