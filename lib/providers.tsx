"use client"

import { setUnauthorizedHandler } from "@/lib/api/client"
import { makeQueryClient } from "@/lib/query"
import { QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  const router = useRouter()

  useEffect(() => {
    setUnauthorizedHandler(() => router.replace("/login"))
    return () => setUnauthorizedHandler(null)
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
