"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"
import { Controller } from "react-hook-form"

export function StatusField({ form }: { form: TicketForm }) {
  const errors = form.form.formState.errors

  return (
    <Field>
      <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
      <Controller
        control={form.form.control}
        name="status"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="ticket-status" aria-invalid={!!errors.status}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="on_sale">On sale</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <FieldError errors={[errors.status]} />
    </Field>
  )
}
