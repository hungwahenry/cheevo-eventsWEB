"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  email: string
  phone: string
  website: string
  onEmailChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onWebsiteChange: (v: string) => void
}

export function ContactSection({
  email,
  phone,
  website,
  onEmailChange,
  onPhoneChange,
  onWebsiteChange,
}: Props) {
  return (
    <section className="bg-card rounded-xl p-5">
      <h2 className="mb-4 text-sm font-semibold">Contact</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact_email">Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={email}
            maxLength={255}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="hello@yourbrand.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact_phone">Phone</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={phone}
            maxLength={30}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+234 800 000 0000"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            maxLength={255}
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="https://yourbrand.com"
          />
        </div>
      </div>
    </section>
  )
}
