"use client"

import { FieldCounter } from "@/components/field-counter"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TicketForm } from "@/features/organizer/events/tickets/hooks"
import { TICKET_LIMITS } from "@/features/organizer/events/tickets/limits"

export function BasicsFields({ form }: { form: TicketForm }) {
  const description = form.form.watch("description")
  const errors = form.form.formState.errors

  return (
    <>
      <Field>
        <FieldLabel htmlFor="ticket-name">Name</FieldLabel>
        <Input
          id="ticket-name"
          maxLength={TICKET_LIMITS.name}
          placeholder="e.g. Early Bird"
          aria-invalid={!!errors.name}
          {...form.form.register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="ticket-description">Description</FieldLabel>
        <Textarea
          id="ticket-description"
          rows={3}
          maxLength={TICKET_LIMITS.description}
          placeholder="What's included with this ticket?"
          aria-invalid={!!errors.description}
          {...form.form.register("description")}
        />
        <FieldCounter
          current={description.length}
          max={TICKET_LIMITS.description}
        />
        <FieldError errors={[errors.description]} />
      </Field>
    </>
  )
}
