"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { ChangeOwnerDialog } from "@/features/admin/organisations/components/change-owner-dialog"
import { OrganisationStatusBadge } from "@/features/admin/organisations/components/organisation-status-badge"
import {
  useChangeOrganisationOwner,
  useDeleteOrganisation,
  useOrganisation,
  useSuspendOrganisation,
  useUnsuspendOrganisation,
} from "@/features/admin/organisations/hooks"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function OrganisationDetail({ id }: { id: string }) {
  const router = useRouter()
  const { data: org, isLoading } = useOrganisation(id)
  const suspend = useSuspendOrganisation()
  const unsuspend = useUnsuspendOrganisation()
  const changeOwner = useChangeOrganisationOwner()
  const deleteOrg = useDeleteOrganisation()
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [ownerOpen, setOwnerOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!org) {
    return <div className="p-6 text-sm">Organisation not found.</div>
  }

  const owner = org.members?.find((m) => m.is_owner)

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/organisations"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Organisations
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{org.name}</h1>
          <p className="text-muted-foreground text-sm">
            {org.slug}
            {org.category ? ` · ${org.category.name}` : ""}
            {org.city ? ` · ${org.city}` : ""}
          </p>
        </div>
        <OrganisationStatusBadge organisation={org} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <Field label="Contact email" value={org.contact_email} />
              <Field label="Contact phone" value={org.contact_phone} />
              <Field label="Website" value={org.website} />
              <Field
                label="Created"
                value={
                  org.created_at
                    ? new Date(org.created_at).toLocaleDateString()
                    : "—"
                }
              />
              <Field label="Events" value={String(org.events_count)} />
              <Field
                label="Subscribers"
                value={String(org.subscribers_count)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {org.members?.length ? (
                org.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {m.username ? `@${m.username}` : m.email}
                      {m.is_owner ? (
                        <span className="text-muted-foreground ml-2 text-xs">
                          (owner)
                        </span>
                      ) : null}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {m.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No members.</p>
              )}
            </CardContent>
          </Card>

          {org.payout_account ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payout account</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                <Field label="Bank" value={org.payout_account.bank_name} />
                <Field
                  label="Account"
                  value={org.payout_account.account_number}
                  mono
                />
                <Field
                  label="Account name"
                  value={org.payout_account.account_name}
                />
              </CardContent>
            </Card>
          ) : null}

          {org.suspended_reason ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suspension reason</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {org.suspended_reason}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {org.suspended_at ? (
              <Button
                variant="secondary"
                onClick={() => unsuspend.mutate(org.id)}
                disabled={unsuspend.isPending}
              >
                Reinstate
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
              onClick={() => setOwnerOpen(true)}
              disabled={changeOwner.isPending}
            >
              Change owner…
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              disabled={deleteOrg.isPending}
            >
              Delete…
            </Button>
            <div className="border-t pt-3 text-xs">
              <div className="text-muted-foreground">Owner</div>
              <div className="font-medium">
                {owner
                  ? owner.username
                    ? `@${owner.username}`
                    : owner.email
                  : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReasonDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title="Suspend organisation?"
        description="Suspended orgs are hidden from feed and search. Owners and admins can still see them."
        confirmLabel="Suspend"
        destructive
        isSubmitting={suspend.isPending}
        onConfirm={(reason) =>
          suspend.mutate(
            { id: org.id, reason },
            { onSuccess: () => setSuspendOpen(false) }
          )
        }
      />

      <ReasonDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete organisation?"
        description="Hard-deletes the organisation and cascades to events, payouts, members. This cannot be undone."
        confirmLabel="Delete"
        destructive
        isSubmitting={deleteOrg.isPending}
        onConfirm={(reason) =>
          deleteOrg.mutate(
            { id: org.id, reason },
            {
              onSuccess: () => {
                setDeleteOpen(false)
                router.push("/admin/organisations")
              },
            }
          )
        }
      />

      <ChangeOwnerDialog
        open={ownerOpen}
        onOpenChange={setOwnerOpen}
        organisation={org}
        isSubmitting={changeOwner.isPending}
        onConfirm={(userId, reason) =>
          changeOwner.mutate(
            { id: org.id, userId, reason },
            { onSuccess: () => setOwnerOpen(false) }
          )
        }
      />
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value ?? "—"}</span>
    </div>
  )
}
