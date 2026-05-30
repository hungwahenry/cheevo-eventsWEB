"use client"

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
import { useCreateEvent } from "@/features/organizer/events/hooks"
import { EVENT_LIMITS } from "@/features/organizer/events/limits"
import { applyApiErrors } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(EVENT_LIMITS.title, `Keep it under ${EVENT_LIMITS.title} characters.`),
})

type FormValues = z.infer<typeof schema>

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const create = useCreateEvent()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values.title.trim())
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset({ title: "" })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Create event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
          <DialogDescription>
            Give it a name to start — you can fill in the rest next.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="event-title">Event name</FieldLabel>
            <Input
              id="event-title"
              maxLength={EVENT_LIMITS.title}
              placeholder="e.g. Detty December"
              autoFocus
              {...form.register("title")}
            />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
