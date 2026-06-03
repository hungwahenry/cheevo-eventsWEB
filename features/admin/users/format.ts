import type { AdminUser } from "@/features/admin/users/types"

export function displayName(user: AdminUser): string {
  if (user.profile?.username) return `@${user.profile.username}`
  const full = [user.profile?.first_name, user.profile?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
  return full || user.email
}
