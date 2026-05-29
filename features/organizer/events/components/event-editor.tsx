"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  usePublishEvent,
  useUpdateEvent,
} from "@/features/organizer/events/hooks"
import type { EventItem } from "@/features/organizer/events/types"
import { isApiError } from "@/lib/api"
import { useState } from "react"

function toLocalInput(iso: string | null): string {
  if (!iso) return ""
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function EventEditor({ event }: { event: EventItem }) {
  const update = useUpdateEvent(event.id)
  const publish = usePublishEvent(event.id)

  const [form, setForm] = useState({
    title: event.title,
    description: event.description ?? "",
    starts_at: toLocalInput(event.starts_at),
    ends_at: toLocalInput(event.ends_at),
    venue_name: event.venue_name ?? "",
    video_url: event.video_url ?? "",
  })
  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const save = () =>
    update.mutate({
      title: form.title,
      description: form.description || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      venue_name: form.venue_name || null,
      video_url: form.video_url || null,
    })

  const published = event.status === "published"
  const publishErrors =
    publish.error && isApiError(publish.error) && publish.error.isValidation
      ? Object.values(publish.error.fieldErrors())
      : []

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <Badge variant={published ? "default" : "secondary"}>
            {event.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={save} disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save"}
          </Button>
          <Button
            onClick={() => publish.mutate()}
            disabled={published || publish.isPending}
          >
            {published
              ? "Published"
              : publish.isPending
                ? "Publishing…"
                : "Publish"}
          </Button>
        </div>
      </header>

      {publishErrors.length > 0 ? (
        <div className="flex flex-col gap-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <p className="font-medium">Before publishing:</p>
          <ul className="list-inside list-disc">
            {publishErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">Details</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What's the event about?"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="starts_at">Starts</Label>
            <Input
              id="starts_at"
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => set("starts_at", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ends_at">Ends</Label>
            <Input
              id="ends_at"
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => set("ends_at", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="venue_name">Venue name</Label>
          <Input
            id="venue_name"
            value={form.venue_name}
            onChange={(e) => set("venue_name", e.target.value)}
            placeholder="e.g. Eko Hotel"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="video_url">Promo video URL</Label>
          <Input
            id="video_url"
            value={form.video_url}
            onChange={(e) => set("video_url", e.target.value)}
            placeholder="https://… (YouTube, IG, TikTok)"
          />
        </div>
      </section>

      <section className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Location search, flyer, gallery & features — coming next.
      </section>
    </div>
  )
}
