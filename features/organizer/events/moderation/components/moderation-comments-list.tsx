"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { ModerationCommentRow } from "@/features/organizer/events/moderation/components/moderation-comment-row"
import { ModerationReplies } from "@/features/organizer/events/moderation/components/moderation-replies"
import { useModerationComments } from "@/features/organizer/events/moderation/hooks"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

type Filter = "all" | "flagged"

export function ModerationCommentsList({ eventId }: { eventId: string }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [filter, search])

  const { data, isLoading, isFetching } = useModerationComments(
    eventId,
    page,
    search || undefined,
    filter === "flagged"
  )

  const items = data?.items ?? []
  const lastPage = data?.last_page ?? 1
  const total = data?.total

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search body or author…"
            className="pl-8"
          />
        </div>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as Filter)}
          variant="outline"
          size="sm">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="flagged">Flagged</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card transition-opacity",
          isFetching && !isLoading ? "opacity-70" : ""
        )}>
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 px-4 py-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium">
              {filter === "flagged" || search
                ? "Nothing matches"
                : "No comments yet"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {filter === "flagged"
                ? "No flagged comments right now."
                : search
                  ? "Try a different search."
                  : "Comments from attendees will appear here. Flag anything that needs an admin's eyes."}
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((comment) => (
              <li key={comment.id}>
                <ModerationCommentRow comment={comment} />
                <ModerationReplies parent={comment} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {lastPage > 1 ? (
        <div className="flex items-center justify-between text-xs">
          <p className="text-muted-foreground">
            Page {page} of {lastPage}
            {total !== undefined ? ` · ${total.toLocaleString()} total` : ""}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}>
              <ChevronLeftIcon className="size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= lastPage}
              onClick={() => setPage(page + 1)}>
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : total !== undefined && total > 0 ? (
        <p className="text-muted-foreground text-xs">
          {total.toLocaleString()} result{total === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  )
}
