"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BroadcastsList } from "@/features/organizer/events/broadcasts/components/broadcasts-list"
import { EventDetailHeader } from "@/features/organizer/events/components/detail/event-detail-header"
import { EventStatsStrip } from "@/features/organizer/events/components/detail/event-stats-strip"
import { IssuedTicketsList } from "@/features/organizer/events/issued-tickets/components/issued-tickets-list"
import { ModerationCommentsList } from "@/features/organizer/events/moderation/components/moderation-comments-list"
import { RsvpsList } from "@/features/organizer/events/rsvps/components/rsvps-list"
import { SalesTab } from "@/features/organizer/events/sales/components/sales-tab"
import type { EventItem } from "@/features/organizer/events/types"

export function EventDetail({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col">
      <EventDetailHeader event={event} />

      <div className="mt-8 flex flex-col gap-8">
        <EventStatsStrip event={event} />

        <Tabs defaultValue="sales" className="gap-4">
          <TabsList>
            <TabsTrigger value="sales">
              Sales
              {event.tickets_sold > 0 ? (
                <span className="ml-1 text-xs text-muted-foreground">
                  {event.tickets_sold.toLocaleString()}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="tickets">
              Tickets
              {event.tickets_sold > 0 ? (
                <span className="ml-1 text-xs text-muted-foreground">
                  {event.tickets_sold.toLocaleString()}
                </span>
              ) : null}
            </TabsTrigger>
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
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesTab eventId={event.id} />
          </TabsContent>

          <TabsContent value="tickets">
            <IssuedTicketsList eventId={event.id} />
          </TabsContent>

          <TabsContent value="rsvps">
            <RsvpsList eventId={event.id} />
          </TabsContent>

          <TabsContent value="comments">
            <ModerationCommentsList eventId={event.id} />
          </TabsContent>

          <TabsContent value="broadcasts">
            <BroadcastsList eventId={event.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
