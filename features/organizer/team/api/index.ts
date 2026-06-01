import { api } from "@/lib/api"

export type OrganisationRole = "owner" | "member"

export type Member = {
  id: string
  email: string
  role: OrganisationRole
  joined_at: string | null
  profile: {
    first_name: string | null
    last_name: string | null
    avatar_url: string
  }
}

export function listMembers(orgId: string): Promise<Member[]> {
  return api.get<Member[]>(`/organizer/organisations/${orgId}/members`)
}

export function addMember(orgId: string, email: string): Promise<Member> {
  return api.post<Member>(`/organizer/organisations/${orgId}/members`, {
    email,
  })
}

export function removeMember(orgId: string, userId: string): Promise<null> {
  return api.delete<null>(`/organizer/organisations/${orgId}/members/${userId}`)
}
