"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import { useBroadcastAnnouncement } from "@/features/admin/notifications/hooks"
import type {
  AnnouncementAudience,
  AnnouncementChannel,
  AnnouncementRole,
} from "@/features/admin/notifications/types"
import { useState } from "react"

const CHANNEL_OPTIONS: { value: AnnouncementChannel; label: string }[] = [
  { value: "inapp", label: "In-app" },
  { value: "push", label: "Push" },
  { value: "email", label: "Email" },
]

export function AnnouncementComposer() {
  const [audience, setAudience] = useState<AnnouncementAudience>("all")
  const [role, setRole] = useState<AnnouncementRole>("attendee")
  const [userIdsRaw, setUserIdsRaw] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [channels, setChannels] = useState<AnnouncementChannel[]>(["inapp"])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const broadcast = useBroadcastAnnouncement()

  const userIds = userIdsRaw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const toggleChannel = (c: AnnouncementChannel) => {
    setChannels((curr) =>
      curr.includes(c) ? curr.filter((v) => v !== c) : [...curr, c]
    )
  }

  const canSubmit =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    channels.length > 0 &&
    (audience !== "user_ids" || userIds.length > 0) &&
    !broadcast.isPending

  const send = () => {
    broadcast.mutate(
      {
        audience,
        role: audience === "role" ? role : undefined,
        user_ids: audience === "user_ids" ? userIds : undefined,
        title: title.trim(),
        body: body.trim(),
        channels,
      },
      {
        onSuccess: () => {
          setTitle("")
          setBody("")
          setConfirmOpen(false)
        },
      }
    )
  }

  const audienceSummary =
    audience === "all"
      ? "all users"
      : audience === "role"
        ? `every ${role}`
        : `${userIds.length} specific user(s)`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New announcement</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>Audience</Label>
          <Select
            value={audience}
            onValueChange={(v) => setAudience(v as AnnouncementAudience)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="role">By role</SelectItem>
              <SelectItem value="user_ids">Specific user IDs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {audience === "role" ? (
          <div className="grid gap-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as AnnouncementRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendee">Attendees</SelectItem>
                <SelectItem value="organiser">Organisers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {audience === "user_ids" ? (
          <div className="grid gap-2">
            <Label htmlFor="user_ids">
              User IDs{" "}
              <span className="text-muted-foreground text-xs">
                (comma or newline separated, ULIDs)
              </span>
            </Label>
            <Textarea
              id="user_ids"
              value={userIdsRaw}
              onChange={(e) => setUserIdsRaw(e.target.value)}
              rows={3}
              placeholder="01HX...&#10;01HY..."
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">
              {userIds.length} ID(s) entered.
            </p>
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Maintenance window tonight"
            maxLength={120}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="What attendees / organisers need to know."
          />
        </div>

        <div className="grid gap-2">
          <Label>Channels</Label>
          <div className="grid grid-cols-3 gap-2">
            {CHANNEL_OPTIONS.map((c) => (
              <label
                key={c.value}
                className="flex items-center gap-2 rounded-md border p-2 text-sm"
              >
                <Checkbox
                  checked={channels.includes(c.value)}
                  onCheckedChange={() => toggleChannel(c.value)}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setConfirmOpen(true)} disabled={!canSubmit}>
            Send announcement
          </Button>
        </div>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Send this announcement?"
        description={`This will queue a notification to ${audienceSummary} via ${channels.join(", ")}.`}
        confirmLabel="Send"
        isSubmitting={broadcast.isPending}
        onConfirm={send}
      />
    </Card>
  )
}
