"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigsManager } from "@/features/admin/system/components/configs-manager"
import { FlagsManager } from "@/features/admin/system/components/flags-manager"

export default function AdminSystemPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System</h1>
        <p className="text-muted-foreground text-sm">
          Feature flags and live config. Every change is audited and bumps the
          public ETag.
        </p>
      </div>
      <Tabs defaultValue="flags">
        <TabsList>
          <TabsTrigger value="flags">Feature flags</TabsTrigger>
          <TabsTrigger value="configs">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="flags" className="pt-4">
          <FlagsManager />
        </TabsContent>
        <TabsContent value="configs" className="pt-4">
          <ConfigsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
