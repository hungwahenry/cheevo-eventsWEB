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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateEvent } from "@/features/organizer/events/hooks"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const create = useCreateEvent()

  const submit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    create.mutate(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-title">Event name</Label>
          <Input
            id="event-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            placeholder="e.g. Detty December"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={!title.trim() || create.isPending}>
            {create.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
