"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function PurchaseLimitField({ form }: { form: TicketForm }) {
  return (
    <SettingsBlock
      title="Purchase limit"
      description="Max tickets of this kind per single order."
      enabled={form.toggles.perOrderLimit}
      onToggle={(v) => form.toggle("perOrderLimit", v)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-max">Max per order</Label>
        <Input
          id="ticket-max"
          inputMode="numeric"
          maxLength={3}
          value={form.form.max_per_order}
          onChange={(e) => form.set("max_per_order", e.target.value)}
          placeholder="4"
        />
      </div>
    </SettingsBlock>
  )
}
