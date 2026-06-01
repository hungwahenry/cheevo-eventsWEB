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
import { useAddMember } from "@/features/organizer/team/hooks"
import { UserPlusIcon } from "lucide-react"
import { useState } from "react"

type Props = { orgId: string }

export function AddMemberDialog({ orgId }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const add = useAddMember(orgId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    add.mutate(email.trim(), {
      onSuccess: () => {
        setOpen(false)
        setEmail("")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="size-4" />
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add a team member</DialogTitle>
            <DialogDescription>
              They must already have a cheevo account. Members can manage events
              and view payouts; only owners can change the team.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member_email">Email</Label>
            <Input
              id="member_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={add.isPending}>
              {add.isPending ? "Adding…" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
