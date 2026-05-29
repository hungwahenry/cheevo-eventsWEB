"use client"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import type { VerifyOtpInput } from "@/features/auth/validation"
import { Controller, type UseFormReturn } from "react-hook-form"

type CodeStepProps = {
  form: UseFormReturn<VerifyOtpInput>
  email: string
  onSubmit: () => void
  onResend: () => void
  onBack: () => void
  canSubmit: boolean
  isVerifying: boolean
}

export function CodeStep({
  form,
  email,
  onSubmit,
  onResend,
  onBack,
  canSubmit,
  isVerifying,
}: CodeStepProps) {
  const error = form.formState.errors.code?.message

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="code">Verification code</Label>
        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              onComplete={onSubmit}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || isVerifying}
        >
          {isVerifying ? "Verifying…" : "Verify"}
        </Button>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-foreground"
          >
            Change email
          </button>
          <button
            type="button"
            onClick={onResend}
            className="font-medium text-primary hover:underline"
          >
            Resend code
          </button>
        </div>
      </div>
    </form>
  )
}
