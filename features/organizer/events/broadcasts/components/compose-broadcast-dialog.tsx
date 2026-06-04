"use client"

import { FieldCounter } from "@/components/field-counter"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateBroadcast,
  useSendTestBroadcast,
} from "@/features/organizer/events/broadcasts/hooks"
import { BROADCAST_LIMITS } from "@/features/organizer/events/broadcasts/limits"
import { RichTextEditor } from "@/components/rich-text-editor"
import type {
  BroadcastAudience,
  CreateBroadcastPayload,
} from "@/features/organizer/events/broadcasts/types"
import { applyApiErrors } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { MegaphoneIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  audience: z.enum(["ticket_holders", "rsvpers", "both"]),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(
      BROADCAST_LIMITS.subject,
      `Keep it under ${BROADCAST_LIMITS.subject} characters.`
    ),
  body_html: z.string().min(1, "Write something to send"),
  body_text: z
    .string()
    .max(
      BROADCAST_LIMITS.body,
      `Body is too long — keep it under ${BROADCAST_LIMITS.body} characters.`
    ),
})

type FormValues = z.infer<typeof schema>

const defaults: FormValues = {
  audience: "ticket_holders",
  subject: "",
  body_html: "",
  body_text: "",
}

export function ComposeBroadcastDialog({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false)
  const create = useCreateBroadcast(eventId)
  const sendTest = useSendTestBroadcast(eventId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })

  const subjectLen = form.watch("subject")?.length ?? 0
  const bodyLen = form.watch("body_text")?.length ?? 0

  const buildPayload = (values: FormValues): CreateBroadcastPayload => ({
    audience: values.audience,
    subject: values.subject.trim(),
    body_html: values.body_html,
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(buildPayload(values))
      setOpen(false)
      form.reset(defaults)
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  const sendPreview = form.handleSubmit(async (values) => {
    try {
      await sendTest.mutateAsync(buildPayload(values))
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset(defaults)
  }

  const errors = form.formState.errors

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <MegaphoneIcon />
          Compose
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New broadcast</DialogTitle>
          <DialogDescription>
            Email your ticket buyers or RSVPers. Sent from your organisation,
            via cheevo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="broadcast-audience">Send to</FieldLabel>
            <Controller
              control={form.control}
              name="audience"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v as BroadcastAudience)}
                >
                  <SelectTrigger id="broadcast-audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ticket_holders">
                      Ticket holders
                    </SelectItem>
                    <SelectItem value="rsvpers">RSVPers</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.audience]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="broadcast-subject">Subject</FieldLabel>
            <Input
              id="broadcast-subject"
              maxLength={BROADCAST_LIMITS.subject}
              placeholder="e.g. Doors open at 9pm"
              aria-invalid={!!errors.subject}
              {...form.register("subject")}
            />
            <FieldError errors={[errors.subject]} />
            <FieldCounter current={subjectLen} max={BROADCAST_LIMITS.subject} />
          </Field>

          <Field>
            <FieldLabel>Body</FieldLabel>
            <Controller
              control={form.control}
              name="body_html"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={(html, text) => {
                    field.onChange(html)
                    form.setValue("body_text", text, { shouldValidate: true })
                  }}
                />
              )}
            />
            <FieldError errors={[errors.body_html, errors.body_text]} />
            <FieldCounter current={bodyLen} max={BROADCAST_LIMITS.body} />
          </Field>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={sendPreview}
              disabled={sendTest.isPending || create.isPending}
            >
              {sendTest.isPending ? "Sending test…" : "Send test to me"}
            </Button>
            <Button type="submit" disabled={create.isPending || sendTest.isPending}>
              {create.isPending ? "Sending…" : "Send broadcast"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
