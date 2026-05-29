"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SendOtpInput } from "@/features/auth/validation"
import type { UseFormReturn } from "react-hook-form"

type EmailStepProps = {
  form: UseFormReturn<SendOtpInput>
  onSubmit: () => void
  canSubmit: boolean
  isSending: boolean
}

export function EmailStep({
  form,
  onSubmit,
  canSubmit,
  isSending,
}: EmailStepProps) {
  const error = form.formState.errors.email?.message

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a verification code.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@email.com"
          aria-invalid={!!error}
          {...form.register("email")}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!canSubmit || isSending}
      >
        {isSending ? "Sending…" : "Send code"}
      </Button>
    </form>
  )
}
