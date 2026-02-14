'use client';

import { useCallback, useEffect } from 'react';
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

  // Commit on blur
  const handleBlur = useCallback(() => {
    if (editor) {
      onSave(editor.getHTML());
    }
  }, [editor, onSave]);

  if (!editor) return null;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
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
