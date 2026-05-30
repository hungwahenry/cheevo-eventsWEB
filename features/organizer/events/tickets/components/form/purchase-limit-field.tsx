"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SettingsBlock } from "@/features/organizer/events/tickets/components/form/settings-block"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function PurchaseLimitField({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

  return (
    <SettingsBlock
      title="Purchase limit"
      description="Max tickets of this kind per single order."
      enabled={form.toggles.perOrderLimit}
      onToggle={(v) => form.toggle("perOrderLimit", v)}
    >
      <Field>
        <FieldLabel htmlFor="ticket-max">Max per order</FieldLabel>
        <Input
          id="ticket-max"
          inputMode="numeric"
          maxLength={3}
          placeholder="4"
          {...form.form.register("max_per_order")}
        />
        <FieldError errors={[errors.max_per_order]} />
      </Field>
    </SettingsBlock>
  )
}
