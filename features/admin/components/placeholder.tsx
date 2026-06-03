import { ConstructionIcon } from "lucide-react"

type Props = {
  title: string
  description?: string
}

export function AdminPlaceholder({ title, description }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <ConstructionIcon className="size-5" />
      </div>
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        {description ?? "This admin area lands in an upcoming sprint."}
      </p>
    </div>
  )
}
