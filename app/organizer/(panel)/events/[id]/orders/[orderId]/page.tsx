"use client"

import { OrderDetail } from "@/features/organizer/events/sales/components/order-detail"
import { useParams } from "next/navigation"

export default function OrderDetailPage() {
  const { id, orderId } = useParams<{ id: string; orderId: string }>()
  return <OrderDetail eventId={id} orderId={orderId} />
}
