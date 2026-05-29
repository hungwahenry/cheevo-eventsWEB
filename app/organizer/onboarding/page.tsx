"use client"

import { useMe } from "@/features/auth"
import { OnboardingWizard } from "@/features/organizer/onboarding"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrganizerOnboardingPage() {
  const { data: user, isLoading } = useMe()
  const router = useRouter()

  // Already an organizer → no onboarding needed.
  useEffect(() => {
    if (!isLoading && user?.is_organizer) {
      router.replace("/organizer")
    }
  }, [isLoading, user, router])

  return <OnboardingWizard />
}
