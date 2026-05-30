import { cn } from "@/lib/utils"

export function FieldCounter({ current, max }: { current: number; max: number }) {
  const near = current / max >= 0.9
  return (
    <p
      className={cn(
        "mt-1 text-right text-xs",
        near ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {current} / {max}
    </p>
  )
}
