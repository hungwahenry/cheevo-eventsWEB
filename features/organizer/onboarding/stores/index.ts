import type { OrganizerOnboardingDraft } from "@/features/organizer/onboarding/types"
import { create } from "zustand"

const emptyDraft: OrganizerOnboardingDraft = {
  name: "",
  slug: "",
  categoryId: null,
  about: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  city: "",
  logo: null,
  cover: null,
  socials: {},
}

type OrganizerOnboardingState = {
  step: number
  draft: OrganizerOnboardingDraft
  patch: (values: Partial<OrganizerOnboardingDraft>) => void
  setSocialHandle: (platformId: number, handle: string) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useOrganizerOnboardingStore = create<OrganizerOnboardingState>(
  (set) => ({
    step: 0,
    draft: emptyDraft,
    patch: (values) =>
      set((state) => ({ draft: { ...state.draft, ...values } })),
    setSocialHandle: (platformId, handle) =>
      set((state) => ({
        draft: {
          ...state.draft,
          socials: { ...state.draft.socials, [platformId]: handle },
        },
      })),
    setStep: (step) => set({ step }),
    reset: () => set({ step: 0, draft: emptyDraft }),
  })
)
