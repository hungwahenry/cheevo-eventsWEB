import { useStepUp } from "@/features/account/hooks/use-step-up"
import { meQueryKey, useMe } from "@/features/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Stage = "collect" | "verify" | "done"

export function useChangeEmail({
  onCompleted,
}: { onCompleted?: () => void } = {}) {
  const queryClient = useQueryClient()
  const { data: user } = useMe()
  const stepUp = useStepUp()

  const [newEmail, setNewEmail] = useState("")
  const [code, setCode] = useState("")

  const currentEmail = user?.email ?? ""

  const stage: Stage =
    stepUp.status === "completed"
      ? "done"
      : stepUp.challenge && !stepUp.challenge.completed
        ? "verify"
        : "collect"

  const nextFactor = stepUp.challenge?.factors.find(
    (f) => f.id === stepUp.challenge?.next_factor_id
  )
  const factorsTotal = stepUp.challenge?.factors.length ?? 0
  const factorIndex = nextFactor ? nextFactor.position + 1 : 0

  const start = async () => {
    const normalizedEmail = newEmail.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      toast.error("Enter a valid email.")
      return
    }
    if (normalizedEmail === currentEmail.trim().toLowerCase()) {
      toast.error("That is already your email.")
      return
    }
    try {
      await stepUp.start({
        action: "change_email",
        payload: { new_email: normalizedEmail },
      })
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not start verification."
      )
    }
  }

  const submitCode = async (value: string) => {
    if (value.length !== 6) return
    try {
      await stepUp.verify(value)
      setCode("")
    } catch (e) {
      setCode("")
      toast.error(e instanceof Error ? e.message : "Wrong code.")
    }
  }

  const resend = async () => {
    try {
      await stepUp.resend()
      toast.success("We sent you a new code.")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not resend.")
    }
  }

  const reset = () => {
    stepUp.reset()
    setNewEmail("")
    setCode("")
  }

  useEffect(() => {
    if (stepUp.status !== "completed") return
    const updatedUser = stepUp.challenge?.result?.user
    if (updatedUser) {
      queryClient.setQueryData(meQueryKey, updatedUser)
    }
    queryClient.invalidateQueries({ queryKey: meQueryKey })
    toast.success("Email updated.")
    onCompleted?.()
  }, [stepUp.status, stepUp.challenge, queryClient, onCompleted])

  return {
    currentEmail,
    stage,
    newEmail,
    setNewEmail,
    code,
    setCode,
    nextFactor,
    factorsTotal,
    factorIndex,
    isStarting: stepUp.status === "creating",
    isVerifying: stepUp.status === "verifying",
    start,
    submitCode,
    resend,
    reset,
  }
}
