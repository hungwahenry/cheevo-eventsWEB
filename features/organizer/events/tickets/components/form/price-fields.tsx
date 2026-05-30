"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

const NAIRA_DIGITS = 7

export function PriceFields({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="ticket-gross">Price</FieldLabel>
        <InputGroup>
          <InputGroupAddon>₦</InputGroupAddon>
          <InputGroupInput
            id="ticket-gross"
            inputMode="numeric"
            maxLength={NAIRA_DIGITS}
            placeholder="5000"
            {...form.form.register("gross_price")}
          />
        </InputGroup>
        <FieldError errors={[errors.gross_price]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="ticket-display">
          Was price <span className="text-muted-foreground">(optional)</span>
        </FieldLabel>
        <InputGroup>
          <InputGroupAddon>₦</InputGroupAddon>
          <InputGroupInput
            id="ticket-display"
            inputMode="numeric"
            maxLength={NAIRA_DIGITS}
            placeholder="7000"
            {...form.form.register("display_price")}
          />
        </InputGroup>
        <FieldError errors={[errors.display_price]} />
      </Field>
    </div>
  )
}
