"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BroadcastsTable } from "@/features/admin/broadcasts/components/broadcasts-table"
import { SuppressionsTable } from "@/features/admin/broadcast-suppressions/components/suppressions-table"

export default function AdminBroadcastsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Broadcasts</h1>
        <p className="text-muted-foreground text-sm">
          Org email broadcasts and the global suppression list.
        </p>
      </div>
      <Tabs defaultValue="broadcasts">
        <TabsList>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="suppressions">Suppressions</TabsTrigger>
        </TabsList>
        <TabsContent value="broadcasts" className="pt-4">
          <BroadcastsTable />
        </TabsContent>
        <TabsContent value="suppressions" className="pt-4">
          <SuppressionsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
