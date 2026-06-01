"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Member } from "@/features/organizer/team/api"
import { useRemoveMember } from "@/features/organizer/team/hooks"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"

type Props = {
  orgId: string
  members: Member[]
  canManage: boolean
  currentUserId: string | undefined
  isLoading: boolean
}

function displayName(member: Member): string {
  const { first_name, last_name } = member.profile
  const name = [first_name, last_name].filter(Boolean).join(" ").trim()
  return name || member.email
}

function initials(member: Member): string {
  const name = displayName(member)
  const parts = name.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

export function MembersTable({
  orgId,
  members,
  canManage,
  currentUserId,
  isLoading,
}: Props) {
  const remove = useRemoveMember(orgId)
  const [target, setTarget] = useState<Member | null>(null)

  const columns: DataTableColumn<Member>[] = [
    {
      id: "person",
      header: "Person",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={member.profile.avatar_url} />
            <AvatarFallback>{initials(member)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {displayName(member)}
              {currentUserId === member.id ? (
                <span className="text-muted-foreground"> (you)</span>
              ) : null}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              {member.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (member) => (
        <Badge variant={member.role === "owner" ? "default" : "secondary"}>
          {member.role === "owner" ? "Owner" : "Member"}
        </Badge>
      ),
    },
  ]

  if (canManage) {
    columns.push({
      id: "actions",
      header: "",
      headerClassName: "w-12",
      cellClassName: "text-right",
      cell: (member) =>
        member.role === "owner" ? null : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTarget(member)}
            aria-label={`Remove ${displayName(member)}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        ),
    })
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        keyExtractor={(member) => member.id}
        empty={{ title: "No team members yet." }}
      />

      <AlertDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? displayName(target) : ""} will lose access to this
              organisation immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target) {
                  remove.mutate(target.id)
                  setTarget(null)
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
