'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle as TextStyleExt } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { TextFormattingToolbar } from './text-formatting-toolbar';

/**
 * Inline rich-text editor powered by Tiptap.
 * Renders inside a slide element when the user double-clicks to edit text.
 *
 * - Content is stored as HTML in the element's `content` field.
 * - A floating toolbar appears above the editor for formatting.
 * - Pressing Escape or clicking outside commits changes and exits edit mode.
 */

interface InlineTextEditorProps {
  /** Initial HTML content. */
  content: string;
  /** Called when the user finishes editing (blur / Escape). */
  onSave: (html: string) => void;
  /** Called when the user presses Escape or clicks outside. */
  onExit: () => void;
  /** Inherit font styles from the element. */
  style?: React.CSSProperties;
}

export function InlineTextEditor({
  content,
  onSave,
  onExit,
  style,
}: InlineTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading — slides use explicit font sizes, not semantic headings
        heading: false,
      }),
      Underline,
      TextStyleExt,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content: content || '<p></p>',
    autofocus: 'end',
    // Prevent SSR hydration mismatch in Next.js — render only on client
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[1em] w-full',
        style: Object.entries(style ?? {})
          .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
          .join(';'),
      },
    },
    onUpdate: () => {
      // No-op during editing — we save on blur / exit
    },
  });

  // Commit content and exit on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editor) {
        onSave(editor.getHTML());
        onExit();
      }
    },
    [editor, onSave, onExit],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Commit on blur.
  // We delay the exit slightly to allow toolbar interactions (e.g. color
  // picker popover, which steals focus briefly) to refocus the editor.
  // If focus returns to the editor or its container the exit is cancelled.
  const handleBlur = useCallback(() => {
    if (!editor) return;
    onSave(editor.getHTML());

    blurTimeoutRef.current = setTimeout(() => {
      const active = document.activeElement;
      // If focus is still inside the container (e.g. toolbar/popover) — keep editing.
      if (containerRef.current?.contains(active)) return;
      // If focus returned to the tiptap editor itself — keep editing.
      if (editor.isFocused) return;
      onExit();
    }, 150);
  }, [editor, onSave, onExit]);

  // Cancel pending blur-exit when component unmounts (e.g. editing ended via
  // parent state change) or when the editor regains focus.
  useEffect(() => {
    if (!editor) return;
    const cancelBlurExit = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
    editor.on('focus', cancelBlurExit);
    return () => {
      cancelBlurExit();
      editor.off('focus', cancelBlurExit);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Floating formatting toolbar */}
      <div className="absolute bottom-full left-0 mb-1 z-50">
        <TextFormattingToolbar editor={editor} />
      </div>
      <EditorContent
        editor={editor}
        onBlur={handleBlur}
        className="[&_.tiptap]:outline-none"
      />
    </div>
  );
}
