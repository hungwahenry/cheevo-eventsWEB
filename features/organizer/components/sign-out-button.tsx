"use client"

import { Button } from "@/components/ui/button"
import { useSignOut } from "@/features/auth"

export function SignOutButton() {
  const { signOut, isPending } = useSignOut()

  return (
    <Button variant="ghost" size="sm" onClick={signOut} disabled={isPending}>
      Sign out
    </Button>
  )
}
