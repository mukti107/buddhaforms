"use client";

import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeEditorProps {
  code: string;
  language?: string;
  theme?: string;
  copyable?: boolean;
}

export default function CodeEditor({ 
  code, 
  language = 'html', 
  theme = 'github-dark',
  copyable = true 
}: CodeEditorProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: theme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to plain text with basic styling if highlighting fails
        setHighlightedCode(`<pre class="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto">${code}</pre>`);
      }
    };

    highlight();
  }, [code, language, theme]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      {copyable && (
        <button 
          onClick={copyToClipboard}
          className={`absolute top-2 right-2 text-sm px-3 py-1 rounded-buddha z-10 ${
            copied ? 'bg-green-500 text-white' : 'bg-buddha-gray-100 text-buddha-gray-700 hover:bg-buddha-gray-200'
          }`}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      )}
      <div 
        className="bg-gray-900 rounded-buddha overflow-auto max-h-[500px] p-4"
        dangerouslySetInnerHTML={{ __html: highlightedCode }} 
      />
    </div>
  );
} 