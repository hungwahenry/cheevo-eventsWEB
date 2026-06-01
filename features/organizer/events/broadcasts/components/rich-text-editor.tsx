"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link } from "@tiptap/extension-link"
import { Underline } from "@tiptap/extension-underline"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
  Unlink2Icon,
} from "lucide-react"
import { useEffect } from "react"

type Props = {
  value: string
  onChange: (html: string, text: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-40 px-3 py-2.5 focus:outline-none",
        "aria-label": placeholder ?? "Body",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === "<p></p>" ? "" : html, editor.getText())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value === "" && editor.getText() !== "") {
      editor.commands.clearContent()
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/20 overflow-hidden rounded-md border focus-within:ring-2">
      <Toolbar editor={editor} />
      <Separator />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const promptLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", prev ?? "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 px-2 py-1.5">
      <ToolBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <BoldIcon className="size-3.5" />
      </ToolBtn>
      <ToolBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <ItalicIcon className="size-3.5" />
      </ToolBtn>
      <ToolBtn
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        label="Underline"
      >
        <UnderlineIcon className="size-3.5" />
      </ToolBtn>
      <Separator orientation="vertical" className="mx-1 h-4" />
      <ToolBtn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        label="Heading 2"
      >
        <Heading2Icon className="size-3.5" />
      </ToolBtn>
      <ToolBtn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        label="Heading 3"
      >
        <Heading3Icon className="size-3.5" />
      </ToolBtn>
      <Separator orientation="vertical" className="mx-1 h-4" />
      <ToolBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet list"
      >
        <ListIcon className="size-3.5" />
      </ToolBtn>
      <ToolBtn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Numbered list"
      >
        <ListOrderedIcon className="size-3.5" />
      </ToolBtn>
      <ToolBtn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="Quote"
      >
        <QuoteIcon className="size-3.5" />
      </ToolBtn>
      <Separator orientation="vertical" className="mx-1 h-4" />
      <ToolBtn
        active={editor.isActive("link")}
        onClick={promptLink}
        label={editor.isActive("link") ? "Edit link" : "Add link"}
      >
        <LinkIcon className="size-3.5" />
      </ToolBtn>
      {editor.isActive("link") ? (
        <ToolBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          label="Remove link"
        >
          <Unlink2Icon className="size-3.5" />
        </ToolBtn>
      ) : null}
    </div>
  )
}

function ToolBtn({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="size-7 p-0"
    >
      {children}
    </Button>
  )
}
