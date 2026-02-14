'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Paintbrush,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

/**
 * Floating toolbar for rich-text formatting inside the Tiptap editor.
 * Appears above the element when inline editing is active.
 */

interface TextFormattingToolbarProps {
  editor: Editor;
}

// ---------------------------------------------------------------------------
// Font sizes for the dropdown
// ---------------------------------------------------------------------------

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 96];

// ---------------------------------------------------------------------------
// Toolbar button helper
// ---------------------------------------------------------------------------

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'h-7 w-7 shrink-0',
        active && 'bg-accent text-accent-foreground',
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Text Color Picker (inline popover)
// ---------------------------------------------------------------------------

function TextColorButton({ editor }: { editor: Editor }) {
  const currentColor =
    (editor.getAttributes('textStyle').color as string) ?? '#000000';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 relative"
          title="Text color"
        >
          <Paintbrush className="h-3.5 w-3.5" />
          <div
            className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start" side="top">
        <HexColorPicker
          color={currentColor}
          onChange={(color) => editor.chain().focus().setColor(color).run()}
        />
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Main toolbar
// ---------------------------------------------------------------------------

export function TextFormattingToolbar({ editor }: TextFormattingToolbarProps) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border bg-background/95 backdrop-blur-sm px-1 py-0.5 shadow-lg"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Bold */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>

      {/* Underline */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-3.5 w-3.5" />
      </ToolbarButton>

      {/* Separator */}
      <div className="mx-0.5 h-5 w-px bg-border" />

      {/* Font Size */}
      <select
        className="h-7 rounded border-none bg-transparent px-1 text-xs focus:outline-none focus:ring-0"
        value=""
        onChange={(e) => {
          const size = e.target.value;
          if (size) {
            editor
              .chain()
              .focus()
              .setMark('textStyle', { fontSize: `${size}px` })
              .run();
          }
        }}
        title="Font size"
      >
        <option value="" disabled>
          Size
        </option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      {/* Separator */}
      <div className="mx-0.5 h-5 w-px bg-border" />

      {/* Text color */}
      <TextColorButton editor={editor} />

      {/* Separator */}
      <div className="mx-0.5 h-5 w-px bg-border" />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>

      {/* Separator */}
      <div className="mx-0.5 h-5 w-px bg-border" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet list"
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered list"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}
