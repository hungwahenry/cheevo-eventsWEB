import {
  useCreateTicket,
  useUpdateTicket,
} from "@/features/organizer/events/tickets/hooks/use-ticket-mutations"
import type { EventTicket } from "@/features/organizer/events/tickets/types"
import type { TicketInput as TicketFormValues } from "@/features/organizer/events/tickets/validation"
import { ticketSchema } from "@/features/organizer/events/tickets/validation"
import { applyApiErrors } from "@/lib/api"
import { toLocalInputValue } from "@/lib/format/datetime"
import { koboToNairaInput, nairaInputToKobo } from "@/lib/format/money"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type Toggles = {
  unlimited: boolean
  salesWindow: boolean
  validity: boolean
  perOrderLimit: boolean
}

type Options = {
  eventId: string
  ticket: EventTicket | null
  isOpen: boolean
  onSuccess?: () => void
}

function defaults(ticket: EventTicket | null): TicketFormValues {
  if (!ticket) {
    return {
      name: "",
      description: "",
      gross_price: "",
      display_price: "",
      quantity: "",
      status: "draft",
      sales_starts_at: "",
      sales_ends_at: "",
      valid_from: "",
      valid_to: "",
      max_per_order: "",
    }
  }
  return {
    name: ticket.name,
    description: ticket.description ?? "",
    gross_price: koboToNairaInput(ticket.gross_price),
    display_price: koboToNairaInput(ticket.display_price),
    quantity: ticket.quantity !== null ? String(ticket.quantity) : "",
    status: ticket.status,
    sales_starts_at: toLocalInputValue(ticket.sales_starts_at),
    sales_ends_at: toLocalInputValue(ticket.sales_ends_at),
    valid_from: toLocalInputValue(ticket.valid_from),
    valid_to: toLocalInputValue(ticket.valid_to),
    max_per_order:
      ticket.max_per_order !== null ? String(ticket.max_per_order) : "",
  }
}

function togglesFromTicket(ticket: EventTicket | null): Toggles {
  if (!ticket) {
    return {
      unlimited: true,
      salesWindow: false,
      validity: false,
      perOrderLimit: false,
    }
  }
  return {
    unlimited: ticket.quantity === null,
    salesWindow:
      ticket.sales_starts_at !== null || ticket.sales_ends_at !== null,
    validity: ticket.valid_from !== null || ticket.valid_to !== null,
    perOrderLimit: ticket.max_per_order !== null,
  }
}

const orNullInt = (value: string) => (value === "" ? null : parseInt(value, 10))

export type TicketForm = ReturnType<typeof useTicketForm>

export function useTicketForm({ eventId, ticket, isOpen, onSuccess }: Options) {
  const create = useCreateTicket(eventId)
  const update = useUpdateTicket(eventId, ticket?.id ?? "")
  const mutation = ticket ? update : create

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: defaults(ticket),
  })

  const [toggles, setToggles] = useState<Toggles>(() =>
    togglesFromTicket(ticket)
  )

  useEffect(() => {
    if (!isOpen) return
    form.reset(defaults(ticket))
    setToggles(togglesFromTicket(ticket))
  }, [isOpen, ticket, form])

  const toggle = <K extends keyof Toggles>(key: K, value: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: value }))

  const submit = form.handleSubmit(async (values) => {
    const gross = nairaInputToKobo(values.gross_price)
    if (gross === null) return

    try {
      await mutation.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim() || null,
        gross_price: gross,
        display_price: nairaInputToKobo(values.display_price),
        quantity: toggles.unlimited ? null : orNullInt(values.quantity),
        status: values.status,
        sales_starts_at: toggles.salesWindow
          ? values.sales_starts_at || null
          : null,
        sales_ends_at: toggles.salesWindow
          ? values.sales_ends_at || null
          : null,
        valid_from: toggles.validity ? values.valid_from || null : null,
        valid_to: toggles.validity ? values.valid_to || null : null,
        max_per_order: toggles.perOrderLimit
          ? orNullInt(values.max_per_order)
          : null,
      })
      onSuccess?.()
    } catch (error) {
      applyApiErrors(form, error)
    }
  })

  return {
    form,
    toggles,
    toggle,
    submit,
    isSubmitting: mutation.isPending,
    isEdit: ticket !== null,
  }
}
