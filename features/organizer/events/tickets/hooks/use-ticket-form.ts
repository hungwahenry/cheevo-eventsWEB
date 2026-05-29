import {
  useCreateTicket,
  useUpdateTicket,
} from "@/features/organizer/events/tickets/hooks/use-ticket-mutations"
import type {
  EventTicket,
  TicketInput,
  TicketStatus,
} from "@/features/organizer/events/tickets/types"
import { isApiError } from "@/lib/api"
import { toLocalInputValue } from "@/lib/format/datetime"
import { koboToNairaInput, nairaInputToKobo } from "@/lib/format/money"
import { useEffect, useState } from "react"

type FormState = {
  name: string
  description: string
  gross_price: string
  display_price: string
  quantity: string
  status: TicketStatus
  sales_starts_at: string
  sales_ends_at: string
  valid_from: string
  valid_to: string
  max_per_order: string
}

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

function blankForm(): FormState {
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

function fromTicket(ticket: EventTicket): FormState {
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

export type TicketForm = ReturnType<typeof useTicketForm>

export function useTicketForm({ eventId, ticket, isOpen, onSuccess }: Options) {
  const create = useCreateTicket(eventId)
  const update = useUpdateTicket(eventId, ticket?.id ?? "")

  const [form, setForm] = useState<FormState>(() =>
    ticket ? fromTicket(ticket) : blankForm()
  )
  const [toggles, setToggles] = useState<Toggles>(() =>
    togglesFromTicket(ticket)
  )

  useEffect(() => {
    if (!isOpen) return
    setForm(ticket ? fromTicket(ticket) : blankForm())
    setToggles(togglesFromTicket(ticket))
  }, [isOpen, ticket])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggle = <K extends keyof Toggles>(key: K, value: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: value }))

  const submit = () => {
    const grossKobo = nairaInputToKobo(form.gross_price)
    if (grossKobo === null) return

    const displayKobo = nairaInputToKobo(form.display_price)
    const quantityNum = form.quantity ? parseInt(form.quantity, 10) : null
    const maxPerOrderNum = form.max_per_order
      ? parseInt(form.max_per_order, 10)
      : null

    const input: TicketInput = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      gross_price: grossKobo,
      display_price: displayKobo,
      quantity: toggles.unlimited ? null : quantityNum,
      status: form.status,
      sales_starts_at: toggles.salesWindow
        ? form.sales_starts_at || null
        : null,
      sales_ends_at: toggles.salesWindow ? form.sales_ends_at || null : null,
      valid_from: toggles.validity ? form.valid_from || null : null,
      valid_to: toggles.validity ? form.valid_to || null : null,
      max_per_order: toggles.perOrderLimit ? maxPerOrderNum : null,
    }

    const mutation = ticket ? update : create
    mutation.mutate(input, { onSuccess: () => onSuccess?.() })
  }

  const mutation = ticket ? update : create
  const errorMessage =
    mutation.error && isApiError(mutation.error) ? mutation.error.message : null

  const canSubmit =
    form.name.trim().length > 0 &&
    nairaInputToKobo(form.gross_price) !== null &&
    (toggles.unlimited || form.quantity.trim() !== "") &&
    !mutation.isPending

  return {
    form,
    toggles,
    set,
    toggle,
    submit,
    isSubmitting: mutation.isPending,
    canSubmit,
    errorMessage,
    isEdit: ticket !== null,
  }
}
