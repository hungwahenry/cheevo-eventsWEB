"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlaceSearch } from "@/features/organizer/events/hooks"
import type { PlaceDetails } from "@/features/organizer/events/types"
import { Loader2Icon, MapPinIcon } from "lucide-react"
import { useState } from "react"

type LocationSectionProps = {
  currentAddress: string | null
  onResolved: (place: PlaceDetails) => void
}

export function LocationSection({
  currentAddress,
  onResolved,
}: LocationSectionProps) {
  const { query, setQuery, predictions, isSearching, resolve } =
    usePlaceSearch()
  const [open, setOpen] = useState(false)

  const handleSelect = async (placeId: string) => {
    setOpen(false)
    const details = await resolve(placeId)
    if (details) onResolved(details)
  }

  const showDropdown =
    open && query.trim().length >= 2 && (isSearching || predictions.length > 0)

  return (
    <div className="relative flex flex-col gap-2">
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        // Slight delay so a click on a prediction registers before the dropdown closes.
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search for a venue or address"
        autoCapitalize="off"
        autoComplete="off"
      />

      {showDropdown ? (
        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-sm">
          {isSearching && predictions.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              Searching…
            </div>
          ) : (
            <ul>
              {predictions.map((prediction) => (
                <li key={prediction.place_id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(prediction.place_id)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{prediction.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {currentAddress ? (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPinIcon className="mt-0.5 size-3 shrink-0" />
          <span className="truncate">{currentAddress}</span>
        </p>
      ) : null}
    </div>
  )
}
