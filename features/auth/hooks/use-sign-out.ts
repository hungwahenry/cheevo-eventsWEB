import { useLogout } from "@/features/auth/hooks/use-auth-mutations"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function useSignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useLogout()

  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear()
        router.replace("/login")
      },
    })

  return { signOut, isPending: logout.isPending }
}
