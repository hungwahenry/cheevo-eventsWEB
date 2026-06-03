import { ReportDetail } from "@/features/admin/reports/components/report-detail"

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ReportDetail id={id} />
}
