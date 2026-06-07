import { useStepUp } from "@/features/account/hooks/use-step-up"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Stage = "confirm" | "verify" | "done"

export function useDeleteAccount({
  onCompleted,
}: { onCompleted?: () => void } = {}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const stepUp = useStepUp()

  const [code, setCode] = useState("")

  const stage: Stage =
    stepUp.status === "completed"
      ? "done"
      : stepUp.challenge && !stepUp.challenge.completed
        ? "verify"
        : "confirm"

  const nextFactor = stepUp.challenge?.factors.find(
    (f) => f.id === stepUp.challenge?.next_factor_id
  )
  const factorsTotal = stepUp.challenge?.factors.length ?? 0
  const factorIndex = nextFactor ? nextFactor.position + 1 : 0

  const start = async () => {
    try {
      await stepUp.start({ action: "delete_account", payload: {} })
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
    setCode("")
  }

  useEffect(() => {
    if (stepUp.status !== "completed") return
    queryClient.clear()
    toast.success("Your account has been deleted.")
    onCompleted?.()
    router.replace("/login")
  }, [stepUp.status, queryClient, router, onCompleted])

  return {
    stage,
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
