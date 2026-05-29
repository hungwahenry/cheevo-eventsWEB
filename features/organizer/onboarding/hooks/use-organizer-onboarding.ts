import {
  useCategories,
  useSlugAvailability,
  useSocialPlatforms,
} from "@/features/organizer/onboarding/hooks/use-onboarding-queries"
import { useCreateOrganisation } from "@/features/organizer/onboarding/hooks/use-create-organisation"
import { useOrganizerOnboardingStore } from "@/features/organizer/onboarding/stores"
import {
  isValidEmail,
  isValidSlug,
  isValidUrl,
} from "@/features/organizer/onboarding/validation"

const TOTAL_STEPS = 4

export function useOrganizerOnboarding() {
  const step = useOrganizerOnboardingStore((s) => s.step)
  const draft = useOrganizerOnboardingStore((s) => s.draft)
  const patch = useOrganizerOnboardingStore((s) => s.patch)
  const setSocialHandle = useOrganizerOnboardingStore((s) => s.setSocialHandle)
  const setStep = useOrganizerOnboardingStore((s) => s.setStep)

  const categories = useCategories()
  const socialPlatforms = useSocialPlatforms()
  const slugStatus = useSlugAvailability(draft.slug)
  const create = useCreateOrganisation()

  // Live per-step validation: errors surface inline, and the footer CTA stays
  // disabled until the current step is valid.
  const errors: Record<string, string | undefined> = {}
  let canContinue = true

  if (step === 0) {
    const slugFormatOk = isValidSlug(draft.slug)
    if (draft.slug && !slugFormatOk) {
      errors.slug = "Lowercase letters, numbers and dashes (min 3)."
    }
    canContinue =
      draft.name.trim().length > 0 &&
      slugFormatOk &&
      slugStatus.available !== false &&
      !slugStatus.isChecking &&
      draft.categoryId !== null
  }

  if (step === 1) {
    if (draft.contactEmail.trim() && !isValidEmail(draft.contactEmail)) {
      errors.contactEmail = "Enter a valid email address."
    }
    if (draft.website.trim() && !isValidUrl(draft.website)) {
      errors.website = "Enter a valid URL (https://…)."
    }
    canContinue = !errors.contactEmail && !errors.website
  }

  const isLastStep = step === TOTAL_STEPS - 1

  const back = () => {
    if (step > 0) setStep(step - 1)
  }

  const next = () => {
    if (!canContinue) return
    if (isLastStep) create.mutate()
    else setStep(step + 1)
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    isLastStep,
    draft,
    patch,
    setSocialHandle,
    categories: categories.data ?? [],
    socialPlatforms: socialPlatforms.data ?? [],
    slugStatus,
    errors,
    canContinue,
    isSubmitting: create.isPending,
    back,
    next,
  }
}

export type OrganizerOnboarding = ReturnType<typeof useOrganizerOnboarding>
