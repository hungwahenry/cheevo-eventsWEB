import { TICKET_LIMITS } from "@/features/organizer/events/tickets/limits"
import { z } from "zod"

const digitsOptional = z
  .string()
  .refine((v) => v === "" || /^\d+$/.test(v), "Enter a positive whole number.")

const capped = (max: number, message: string) =>
  digitsOptional.refine((v) => v === "" || Number(v) <= max, message)

const NAIRA_CAP = TICKET_LIMITS.grossPrice / 100

export const ticketSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(
        TICKET_LIMITS.name,
        `Keep it under ${TICKET_LIMITS.name} characters.`
      ),
    description: z.string().max(TICKET_LIMITS.description),
    gross_price: z
      .string()
      .min(1, "Price is required")
      .refine((v) => /^\d+$/.test(v), "Enter a valid price.")
      .refine(
        (v) => Number(v) <= NAIRA_CAP,
        `Up to ₦${NAIRA_CAP.toLocaleString()}.`
      ),
    display_price: capped(NAIRA_CAP, `Up to ₦${NAIRA_CAP.toLocaleString()}.`),
    quantity: capped(TICKET_LIMITS.quantity, "Quantity is too high."),
    status: z.enum(["draft", "on_sale", "paused"]),
    sales_starts_at: z.string(),
    sales_ends_at: z.string(),
    valid_from: z.string(),
    valid_to: z.string(),
    max_per_order: capped(
      TICKET_LIMITS.maxPerOrder,
      `Up to ${TICKET_LIMITS.maxPerOrder} per order.`
    ),
  })
  .refine(
    (d) =>
      !d.sales_starts_at ||
      !d.sales_ends_at ||
      d.sales_ends_at >= d.sales_starts_at,
    {
      path: ["sales_ends_at"],
      message: "Sales must end after they start.",
    }
  )
  .refine((d) => !d.valid_from || !d.valid_to || d.valid_to >= d.valid_from, {
    path: ["valid_to"],
    message: "Validity must end after it starts.",
  })

export type TicketInput = z.infer<typeof ticketSchema>
