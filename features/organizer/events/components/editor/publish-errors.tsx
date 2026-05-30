export function PublishErrors({
  title = "Before publishing:",
  errors,
}: {
  title?: string
  errors: string[]
}) {
  if (errors.length === 0) return null

  return (
    <div className="-mx-6 border-b border-destructive/30 bg-destructive/5 text-destructive">
      <div className="flex flex-col gap-1 px-6 py-3 text-sm">
        <p className="font-medium">{title}</p>
        <ul className="list-inside list-disc">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
