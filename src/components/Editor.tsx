'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-expect-error: Plugin lacks official types
import Header from '@editorjs/header';
// @ts-expect-error: Plugin lacks official types
import List from '@editorjs/list';
// @ts-expect-error: Plugin lacks official types
import CodeTool from '@editorjs/code';
// @ts-expect-error: Plugin lacks official types
import Paragraph from '@editorjs/paragraph';
// @ts-expect-error: Plugin lacks official types
import Quote from '@editorjs/quote';
// @ts-expect-error: Plugin lacks official types
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
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [data, onChange]);

  return <div id="editorjs" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }} />;
};

export default Editor;
