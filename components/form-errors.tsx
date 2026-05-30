export function FormErrors({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null
  return (
    <ul className="space-y-1">
      {messages.map((message, i) => (
        <li key={i} className="text-sm text-destructive">
          {message}
        </li>
      ))}
    </ul>
  )
}
