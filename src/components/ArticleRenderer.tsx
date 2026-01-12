'use client';

import React from 'react';
import { OutputData } from '@editorjs/editorjs';

const ArticleRenderer = ({ data }: { data: OutputData }) => {
  return (
    <div className="prose lg:prose-xl">
      {data.blocks.map((block) => {
        switch (block.type) {
          case 'header':
            const level = block.data.level;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Tag = `h${level}` as any;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={block.id}>
                {block.data.items.map((item: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );
          case 'quote':
            return (
              <blockquote key={block.id}>
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                <cite dangerouslySetInnerHTML={{ __html: block.data.caption }} />
              </blockquote>
            );
          case 'code':
            return (
              <pre key={block.id}>
                <code>{block.data.code}</code>
              </pre>
            );
          case 'delimiter':
            return <hr key={block.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ArticleRenderer;
