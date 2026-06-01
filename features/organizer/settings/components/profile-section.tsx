"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/features/organizer/settings/hooks"

type Props = {
  name: string
  slug: string
  categoryId: number | null
  city: string
  about: string
  onNameChange: (v: string) => void
  onSlugChange: (v: string) => void
  onCategoryChange: (v: number) => void
  onCityChange: (v: string) => void
  onAboutChange: (v: string) => void
}

export function ProfileSection({
  name,
  slug,
  categoryId,
  city,
  about,
  onNameChange,
  onSlugChange,
  onCategoryChange,
  onCityChange,
  onAboutChange,
}: Props) {
  const categories = useCategories()

  return (
    <section className="bg-card rounded-xl p-5">
      <h2 className="mb-4 text-sm font-semibold">Profile</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            maxLength={80}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Handle</Label>
          <Input
            id="slug"
            value={slug}
            maxLength={50}
            onChange={(e) =>
              onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          {categories.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={categoryId !== null ? String(categoryId) : ""}
              onValueChange={(v) => onCategoryChange(Number(v))}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {(categories.data ?? []).map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            maxLength={60}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Lagos"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={about}
            maxLength={600}
            rows={4}
            onChange={(e) => onAboutChange(e.target.value)}
            placeholder="What kind of events do you run?"
          />
          <p className="text-muted-foreground text-right text-xs">
            {about.length}/600
          </p>
        </div>
      </div>
    </section>
  )
}
