"use client"

import { useMe } from "@/features/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: user, isLoading, isError } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (isError || !user) {
      router.replace("/login")
      return
    }
    if (user.role === "admin") {
      router.replace("/admin")
      return
    }
    router.replace("/organizer")
  }, [isError, isLoading, user, router])

  return null
}
