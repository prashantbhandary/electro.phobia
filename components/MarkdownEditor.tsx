'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const options = useMemo(() => ({
    spellChecker: false,
    placeholder: placeholder || 'Write your content in markdown...',
    status: false,
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ] as any,
  }), [placeholder]);

  return (
    <div className="markdown-editor">
      <SimpleMDE value={value || ''} onChange={onChange} options={options as any} />
    </div>
  );
}
