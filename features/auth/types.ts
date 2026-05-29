export type UserRole = "attendee" | "organiser" | "admin"

export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say"

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  username: string | null
  avatar_url: string
  gender: Gender | null
  bio: string | null
  date_of_birth: string | null
  city: string | null
  place_name: string | null
  latitude: string | null
  longitude: string | null
  marketing_opt_in: boolean
  referral_code: string
  completed: boolean
}

export type OrganisationCategory = {
  id: number
  slug: string
  name: string
}

export type OrganisationSocial = {
  platform: string
  name: string
  handle: string
  url: string | null
}

export type Organisation = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_url: string | null
  about: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  city: string | null
  category: OrganisationCategory | null
  socials: OrganisationSocial[]
}

export type User = {
  id: string
  email: string
  role: UserRole
  email_verified: boolean
  onboarding_completed: boolean
  is_organizer: boolean
  profile: Profile
  organisations: Organisation[]
}
