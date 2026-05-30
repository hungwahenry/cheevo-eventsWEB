"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"

export function QuantityField({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

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
        <Field>
          <FieldLabel htmlFor="ticket-quantity">Quantity</FieldLabel>
          <Input
            id="ticket-quantity"
            inputMode="numeric"
            maxLength={6}
            placeholder="100"
            aria-invalid={!!errors.quantity}
            {...form.form.register("quantity")}
          />
          <FieldError errors={[errors.quantity]} />
        </Field>
      ) : null}
    </div>
  )
}
