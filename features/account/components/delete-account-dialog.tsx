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
import { useDeleteAccount } from "@/features/account/hooks"
import { StepUpVerify } from "@/features/account/components/step-up-verify"
import { useState } from "react"

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false)
  const account = useDeleteAccount({ onCompleted: () => setOpen(false) })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) account.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            {account.stage === "confirm"
              ? "This is permanent. Your account and data will be removed and can’t be recovered."
              : "Verify it’s you to permanently delete your account."}
          </DialogDescription>
        </DialogHeader>

        {account.stage === "confirm" ? (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              We’ll send a 6-digit code to your email to confirm.
            </p>
            <Button
              variant="destructive"
              disabled={account.isStarting}
              onClick={account.start}
            >
              {account.isStarting ? "Sending…" : "Send verification code"}
            </Button>
          </div>
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
