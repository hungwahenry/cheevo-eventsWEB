"use client"

import { Button } from "@/components/ui/button"
import { useSignOut } from "@/features/auth"
import { BasicsStep } from "@/features/organizer/onboarding/components/basics-step"
import { BrandingStep } from "@/features/organizer/onboarding/components/branding-step"
import { DetailsStep } from "@/features/organizer/onboarding/components/details-step"
import { SocialsStep } from "@/features/organizer/onboarding/components/socials-step"
import { useOrganizerOnboarding } from "@/features/organizer/onboarding/hooks"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "Tell us about your organisation",
    subtitle: "The basics attendees will see.",
  },
  {
    title: "Contact & details",
    subtitle: "How people reach you — all optional.",
  },
  { title: "Branding", subtitle: "Add a logo and cover. Optional." },
  { title: "Social links", subtitle: "Connect your socials. Optional." },
]

export function OnboardingWizard() {
  const wizard = useOrganizerOnboarding()
  const { signOut } = useSignOut()
  const meta = STEPS[wizard.step]

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <span className="font-semibold tracking-tight">cheevo</span>
        <Button variant="ghost" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {STEPS.map((stepMeta, index) => (
          <div
            key={stepMeta.title}
            className={cn(
              "h-1 flex-1 rounded-full",
              index <= wizard.step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Step {wizard.step + 1} of {wizard.totalSteps}
      </p>

      <div className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
      </div>

      <div className="mt-8 flex-1">
        {wizard.step === 0 ? <BasicsStep wizard={wizard} /> : null}
        {wizard.step === 1 ? <DetailsStep wizard={wizard} /> : null}
        {wizard.step === 2 ? <BrandingStep wizard={wizard} /> : null}
        {wizard.step === 3 ? <SocialsStep wizard={wizard} /> : null}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        {wizard.step > 0 ? (
          <Button
            variant="ghost"
            onClick={wizard.back}
            disabled={wizard.isSubmitting}
          >
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          onClick={wizard.next}
          disabled={!wizard.canContinue || wizard.isSubmitting}
        >
          {wizard.isLastStep
            ? wizard.isSubmitting
              ? "Creating…"
              : "Create organisation"
            : "Continue"}
        </Button>
      </div>
    </div>
  )
}
