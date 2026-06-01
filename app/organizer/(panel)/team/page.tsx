"use client"

import { useMe } from "@/features/auth"
import { AddMemberDialog } from "@/features/organizer/team/components/add-member-dialog"
import { MembersTable } from "@/features/organizer/team/components/members-table"
import { useTeam } from "@/features/organizer/team/hooks"

export default function OrganizerTeamPage() {
  const { data: user } = useMe()
  const organisation = user?.organisations[0]
  const team = useTeam(organisation?.id)

  const ownerId = team.data?.find((m) => m.role === "owner")?.id
  const canManage = !!user && !!ownerId && user.id === ownerId

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm">
            People who can manage this organisation.
          </p>
        </div>
        {canManage && organisation ? (
          <AddMemberDialog orgId={organisation.id} />
        ) : null}
      </div>

      {organisation ? (
        <MembersTable
          orgId={organisation.id}
          members={team.data ?? []}
          canManage={canManage}
          currentUserId={user?.id}
          isLoading={team.isLoading}
        />
      ) : null}
    </div>
  )
}
