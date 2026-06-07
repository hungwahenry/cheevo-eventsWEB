"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {
  targetMasked: string
  factorIndex: number
  factorsTotal: number
  value: string
  onChange: (value: string) => void
  onComplete: (value: string) => void
  onResend: () => void
  isVerifying: boolean
}

export function StepUpVerify({
  targetMasked,
  factorIndex,
  factorsTotal,
  value,
  onChange,
  onComplete,
  onResend,
  isVerifying,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {factorsTotal > 1 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: factorsTotal }).map((_, i) => {
              const active = i + 1 === factorIndex
              const done = i + 1 < factorIndex
              return (
                <div
                  key={i}
                  className={
                    "h-1.5 flex-1 rounded-full " +
                    (active ? "bg-primary" : done ? "bg-primary/60" : "bg-muted")
                  }
                />
              )
            })}
          </div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Step {factorIndex} of {factorsTotal}
          </p>
        </div>
      ) : null}

      <p className="text-muted-foreground text-sm">
        Enter the 6-digit code we sent to{" "}
        <span className="text-foreground font-medium">{targetMasked}</span>.
      </p>

      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
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

      <button
        type="button"
        onClick={onResend}
        disabled={isVerifying}
        className="text-muted-foreground self-start text-sm"
      >
        Didn&apos;t get it?{" "}
        <span className="text-primary font-medium hover:underline">
          Resend code
        </span>
      </button>
    </div>
  )
}
