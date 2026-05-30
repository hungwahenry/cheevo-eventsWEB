"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BasicsFields } from "@/features/organizer/events/tickets/components/form/basics-fields"
import { PriceFields } from "@/features/organizer/events/tickets/components/form/price-fields"
import { PurchaseLimitField } from "@/features/organizer/events/tickets/components/form/purchase-limit-field"
import { QuantityField } from "@/features/organizer/events/tickets/components/form/quantity-field"
import { SalesWindowField } from "@/features/organizer/events/tickets/components/form/sales-window-field"
import { StatusField } from "@/features/organizer/events/tickets/components/form/status-field"
import { ValidityField } from "@/features/organizer/events/tickets/components/form/validity-field"
import { useTicketForm } from "@/features/organizer/events/tickets/hooks"
import type { EventTicket } from "@/features/organizer/events/tickets/types"

type TicketFormDialogProps = {
  eventId: string
  ticket: EventTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketFormDialog({
  eventId,
  ticket,
  open,
  onOpenChange,
}: TicketFormDialogProps) {
  const form = useTicketForm({
    eventId,
    ticket,
    isOpen: open,
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {form.isEdit ? "Edit ticket" : "Add ticket"}
          </DialogTitle>
          <DialogDescription>
            Name, price, availability and optional sale settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.submit} className="flex flex-col gap-4">
          <BasicsFields form={form} />
          <PriceFields form={form} />
          <QuantityField form={form} />
          <StatusField form={form} />
          <SalesWindowField form={form} />
          <ValidityField form={form} />
          <PurchaseLimitField form={form} />

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.isSubmitting}>
              {form.isSubmitting
                ? "Saving…"
                : form.isEdit
                  ? "Save changes"
                  : "Add ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
