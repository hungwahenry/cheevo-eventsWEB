"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function ValidityField({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

  return (
    <SettingsBlock
      title="Ticket validity"
      description="When this ticket actually grants entry."
      enabled={form.toggles.validity}
      onToggle={(v) => form.toggle("validity", v)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="ticket-valid-from">From</FieldLabel>
          <Input
            id="ticket-valid-from"
            type="datetime-local"
            {...form.form.register("valid_from")}
          />
          <FieldError errors={[errors.valid_from]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="ticket-valid-to">To</FieldLabel>
          <Input
            id="ticket-valid-to"
            type="datetime-local"
            {...form.form.register("valid_to")}
          />
          <FieldError errors={[errors.valid_to]} />
        </Field>
      </div>
    </SettingsBlock>
  )
}
