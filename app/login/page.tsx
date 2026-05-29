"use client"

import { useLogin } from "@/features/auth"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { CodeStep } from "@/features/auth/components/code-step"
import { EmailStep } from "@/features/auth/components/email-step"

export default function LoginPage() {
  const login = useLogin()

  return (
    <AuthShell>
      {login.step === "email" ? (
        <EmailStep
          form={login.emailForm}
          onSubmit={login.submitEmail}
          canSubmit={login.canSendEmail}
          isSending={login.isSending}
        />
      ) : (
        <CodeStep
          form={login.codeForm}
          email={login.email}
          onSubmit={login.submitCode}
          onResend={login.resend}
          onBack={login.backToEmail}
          canSubmit={login.canVerify}
          isVerifying={login.isVerifying}
        />
      )}
    </AuthShell>
  )
}
