"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventDetailHeader } from "@/features/organizer/events/components/detail/event-detail-header"
import { EventStatsStrip } from "@/features/organizer/events/components/detail/event-stats-strip"
import { ModerationCommentsList } from "@/features/organizer/events/moderation/components/moderation-comments-list"
import { RsvpsList } from "@/features/organizer/events/rsvps/components/rsvps-list"
import type { EventItem } from "@/features/organizer/events/types"

export function EventDetail({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col">
      <EventDetailHeader event={event} />

      <div className="mt-8 flex flex-col gap-8">
        <EventStatsStrip event={event} />

        <Tabs defaultValue="rsvps" className="gap-4">
          <TabsList>
            <TabsTrigger value="rsvps">
              RSVPs
              {event.rsvps_count > 0 ? (
                <span className="ml-1 text-xs text-muted-foreground">
                  {event.rsvps_count.toLocaleString()}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {event.comments_count > 0 ? (
                <span className="ml-1 text-xs text-muted-foreground">
                  {event.comments_count.toLocaleString()}
                </span>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rsvps">
            <RsvpsList eventId={event.id} />
          </TabsContent>

          <TabsContent value="comments">
            <ModerationCommentsList eventId={event.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
