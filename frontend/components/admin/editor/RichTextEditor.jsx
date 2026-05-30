"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import styles from './Editor.module.scss';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/posts/upload-image`, {
          method: 'POST', body: formData, credentials: 'include', 
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch (error) {
        alert('Failed to upload inline image.');
      }
    };
    input.click();
  };

  return (
    <div className={styles.toolbar} role="toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.active : ''}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.active : ''}`}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}>H3</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${styles.toolbarBtn} ${editor.isActive('blockquote') ? styles.active : ''}`}>Quote</button>
      <button type="button" onClick={addImage} className={styles.toolbarBtn}>🖼 Image</button>

      {/* Table Buttons */}
      <span className={styles.toolbarDivider}>|</span>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={styles.toolbarBtn}>
        ➕ Table
      </button>
      <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={styles.toolbarBtn} disabled={!editor.can().deleteTable()}>
        🗑 Table
      </button>
      <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={styles.toolbarBtn} disabled={!editor.can().addColumnAfter()}>
        + Col
      </button>
      <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={styles.toolbarBtn} disabled={!editor.can().addRowAfter()}>
        + Row
      </button>
      <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className={styles.toolbarBtn} disabled={!editor.can().deleteColumn()}>
        - Col
      </button>
      <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className={styles.toolbarBtn} disabled={!editor.can().deleteRow()}>
        - Row
      </button>
    </div>
  );
};

export default function RichTextEditor({ content = '', onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'content-image' } }),
      Placeholder.configure({ placeholder: 'Start writing your plog post here...' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files[0] || moved) return false; 
        const file = event.dataTransfer.files[0];
        if (!file.type.startsWith('image/')) return false; 

        event.preventDefault(); 
        const uploadDroppedImage = async () => {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${baseUrl}/api/posts/upload-image`, {
              method: 'POST', body: formData, credentials: 'include',
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (coordinates) {
              view.dispatch(view.state.tr.insert(coordinates.pos, view.state.schema.nodes.image.create({ src: data.url })));
            }
          } catch (error) { alert('Failed to upload dropped image.'); }
        };
        uploadDroppedImage();
        return true; 
      },
    },
  });

  return (
    <div className={styles.container}>
      <MenuBar editor={editor} />
      <div className={styles.editorArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}