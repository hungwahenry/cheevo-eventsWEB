import {
  useSendOtp,
  useVerifyOtp,
} from "@/features/auth/hooks/use-auth-mutations"
import { meQueryKey } from "@/features/auth/hooks/use-me"
import {
  sendOtpSchema,
  verifyOtpSchema,
  type SendOtpInput,
  type VerifyOtpInput,
} from "@/features/auth/validation"
import { isApiError } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

/** Two-step OTP login: enter email → verify code. On success the cookie is set and we route to the dashboard. */
export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")

  const emailForm = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  const codeForm = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onTouched",
    defaultValues: { email: "", code: "" },
  })

  const canSendEmail = sendOtpSchema.safeParse(emailForm.watch()).success
  const canVerify = verifyOtpSchema.safeParse(codeForm.watch()).success

  const submitEmail = emailForm.handleSubmit((data) => {
    sendOtp.mutate(data, {
      onSuccess: () => {
        setEmail(data.email)
        codeForm.setValue("email", data.email)
        setStep("code")
        toast.success(`We sent a code to ${data.email}.`)
      },
      onError: (error) => {
        if (
          isApiError(error) &&
          error.isValidation &&
          error.fieldErrors().email
        ) {
          emailForm.setError("email", { message: error.fieldErrors().email })
        }
      },
    })
  })

  const submitCode = codeForm.handleSubmit((data) => {
    verifyOtp.mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: meQueryKey })
        router.replace("/dashboard")
      },
      onError: (error) => {
        if (isApiError(error) && error.isValidation) {
          codeForm.setError("code", { message: error.message })
        }
      },
    })
  })

  const resend = () => {
    if (!email) return
    sendOtp.mutate(
      { email },
      { onSuccess: () => toast.success("We sent a new code.") }
    )
  }

  const backToEmail = () => {
    setStep("email")
    codeForm.reset({ email, code: "" })
  }

  return {
    step,
    email,
    emailForm,
    codeForm,
    canSendEmail,
    canVerify,
    submitEmail,
    submitCode,
    resend,
    backToEmail,
    isSending: sendOtp.isPending,
    isVerifying: verifyOtp.isPending,
  }
}
