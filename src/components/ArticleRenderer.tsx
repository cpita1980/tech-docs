'use client';

import React from 'react';
import { OutputData } from '@editorjs/editorjs';

const ArticleRenderer = ({ data }: { data: OutputData }) => {
  const renderHeader = (block: { id?: string; data: { level: number; text: string } }) => {
    const level = block.data.level;
    const HeaderTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return <HeaderTag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
  };

  return (
    <div className="prose lg:prose-xl">
      {data.blocks.map((block) => {
        switch (block.type) {
          case 'header':
            return renderHeader(block as { id?: string; data: { level: number; text: string } });
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
