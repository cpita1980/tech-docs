'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';

interface EditorProps {
  data?: OutputData;
  onChange(data: OutputData): void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          code: CodeTool,
          paragraph: Paragraph,
          quote: Quote,
          delimiter: Delimiter,
        },
        data: data || undefined,
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
        placeholder: 'Empieza a escribir tu increíble artículo...',
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        // EditorJS destroy method might be async or sync depending on version, 
        // but reliable cleanup matches component unmount.
        // checking function existence is safe practice.
        try {
          editorRef.current.destroy();
        } catch (e) {
          console.error('Editor cleanup failed', e);
        }
        editorRef.current = null;
      }
    };
    // data is excluded from dependency array to prevent re-init on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="editorjs" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }} />;
};

export default Editor;
