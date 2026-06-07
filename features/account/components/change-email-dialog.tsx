"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangeEmail } from "@/features/account/hooks"
import { StepUpVerify } from "@/features/account/components/step-up-verify"
import { useState } from "react"

export function ChangeEmailDialog() {
  const [open, setOpen] = useState(false)
  const account = useChangeEmail({ onCompleted: () => setOpen(false) })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) account.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Change email</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>
            {account.stage === "collect"
              ? "We’ll send a code to your current email, then to your new one. Both must check out before we switch."
              : "Verify it’s you to finish the switch."}
          </DialogDescription>
        </DialogHeader>

        {account.stage === "collect" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              account.start()
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label>Current email</Label>
              <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm">
                {account.currentEmail}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new_email">New email</Label>
              <Input
                id="new_email"
                type="email"
                autoComplete="email"
                value={account.newEmail}
                onChange={(e) => account.setNewEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <Button type="submit" disabled={account.isStarting}>
              {account.isStarting ? "Sending…" : "Continue"}
            </Button>
          </form>
        ) : null}

        {account.stage === "verify" && account.nextFactor ? (
          <StepUpVerify
            targetMasked={account.nextFactor.target_masked}
            factorIndex={account.factorIndex}
            factorsTotal={account.factorsTotal}
            value={account.code}
            onChange={account.setCode}
            onComplete={account.submitCode}
            onResend={account.resend}
            isVerifying={account.isVerifying}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
