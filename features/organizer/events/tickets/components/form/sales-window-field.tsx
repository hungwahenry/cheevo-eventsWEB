"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function SalesWindowField({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

  return (
    <SettingsBlock
      title="Sales period"
      description="Limit when this ticket can be bought."
      enabled={form.toggles.salesWindow}
      onToggle={(v) => form.toggle("salesWindow", v)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="ticket-sales-from">From</FieldLabel>
          <Input
            id="ticket-sales-from"
            type="datetime-local"
            aria-invalid={!!errors.sales_starts_at}
            {...form.form.register("sales_starts_at")}
          />
          <FieldError errors={[errors.sales_starts_at]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="ticket-sales-to">To</FieldLabel>
          <Input
            id="ticket-sales-to"
            type="datetime-local"
            aria-invalid={!!errors.sales_ends_at}
            {...form.form.register("sales_ends_at")}
          />
          <FieldError errors={[errors.sales_ends_at]} />
        </Field>
      </div>
    </SettingsBlock>
  )
}
