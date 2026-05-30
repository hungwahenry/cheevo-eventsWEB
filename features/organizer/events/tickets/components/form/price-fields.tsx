"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

const NAIRA_DIGITS = 7

export function PriceFields({ form }: { form: TicketForm }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-gross">Price</Label>
        <InputGroup>
          <InputGroupAddon>₦</InputGroupAddon>
          <InputGroupInput
            id="ticket-gross"
            inputMode="numeric"
            maxLength={NAIRA_DIGITS}
            value={form.form.gross_price}
            onChange={(e) => form.set("gross_price", e.target.value)}
            placeholder="5000"
          />
        </InputGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-display">
          Was price <span className="text-muted-foreground">(optional)</span>
        </Label>
        <InputGroup>
          <InputGroupAddon>₦</InputGroupAddon>
          <InputGroupInput
            id="ticket-display"
            inputMode="numeric"
            maxLength={NAIRA_DIGITS}
            value={form.form.display_price}
            onChange={(e) => form.set("display_price", e.target.value)}
            placeholder="7000"
          />
        </InputGroup>
      </div>
    </div>
  )
}
