"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { displayName } from "@/features/admin/users/format"
import {
  useRevokeUserSessions,
  useSuspendUser,
  useUnsuspendUser,
  useUser,
} from "@/features/admin/users/hooks"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function UserDetail({ id }: { id: string }) {
  const { data: user, isLoading } = useUser(id)
  const suspend = useSuspendUser()
  const unsuspend = useUnsuspendUser()
  const revoke = useRevokeUserSessions()
  const [suspendOpen, setSuspendOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!user) {
    return <div className="p-6 text-sm">User not found.</div>
  }

  const name = displayName(user)
  const isSuspended = Boolean(user.suspended_at)

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/users"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Users
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="size-12">
          {user.profile?.avatar_url ? (
            <AvatarImage src={user.profile.avatar_url} alt={name} />
          ) : null}
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={user.role === "admin" ? "default" : "outline"}>
            {user.role}
          </Badge>
          {isSuspended ? (
            <Badge variant="destructive">Suspended</Badge>
          ) : (
            <Badge variant="secondary">Active</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          {isSuspended ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suspension</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1 text-sm">
                <span className="text-muted-foreground text-xs">Reason</span>
                <p>{user.suspended_reason ?? "—"}</p>
                <span className="text-muted-foreground mt-2 text-xs">
                  Since
                </span>
                <p>
                  {user.suspended_at
                    ? new Date(user.suspended_at).toLocaleString()
                    : "—"}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <Stat label="Orders" value={user.counts?.orders ?? 0} />
                <Stat label="Organisations" value={user.counts?.organisations ?? 0} />
                <Stat label="Active sessions" value={user.counts?.tokens ?? 0} />
                <Stat
                  label="Joined"
                  value={
                    user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "—"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {user.profile ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                <Field label="Username" value={user.profile.username} />
                <Field label="First name" value={user.profile.first_name} />
                <Field label="Last name" value={user.profile.last_name} />
                <Field label="City" value={user.profile.city} />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {isSuspended ? (
              <Button
                variant="secondary"
                onClick={() => unsuspend.mutate(user.id)}
                disabled={unsuspend.isPending}
              >
                Unsuspend
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setSuspendOpen(true)}
                disabled={suspend.isPending}
              >
                Suspend…
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => revoke.mutate(user.id)}
              disabled={revoke.isPending}
            >
              Revoke sessions
            </Button>
          </CardContent>
        </Card>
      </div>

      <ReasonDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title={`Suspend ${name}?`}
        description="The user will be signed out everywhere and blocked from all authenticated endpoints until unsuspended."
        confirmLabel="Suspend"
        destructive
        isSubmitting={suspend.isPending}
        onConfirm={(reason) => {
          suspend.mutate(
            { id: user.id, reason },
            { onSuccess: () => setSuspendOpen(false) }
          )
        }}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span>{value ?? "—"}</span>
    </div>
  )
}
