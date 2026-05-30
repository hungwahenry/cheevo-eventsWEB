"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function QuantityField({ form }: { form: TicketForm }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Unlimited quantity</p>
          <p className="text-xs text-muted-foreground">
            Turn off to cap how many can be sold.
          </p>
        </div>
        <Switch
          checked={form.toggles.unlimited}
          onCheckedChange={(v) => form.toggle("unlimited", v)}
        />
      </div>
      {!form.toggles.unlimited ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="ticket-quantity">Quantity</Label>
          <Input
            id="ticket-quantity"
            inputMode="numeric"
            maxLength={6}
            value={form.form.quantity}
            onChange={(e) => form.set("quantity", e.target.value)}
            placeholder="100"
          />
        </div>
      ) : null}
    </div>
  )
}
