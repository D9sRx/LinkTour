'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Code, Heading1, Heading2, Quote } from 'lucide-react';

interface TextEditorProps {
  initialValue?: string;
  onSave: (content: string) => void;
  placeholder?: string;
}

export default function TextEditor({
  initialValue = '',
  onSave,
  placeholder = '开始记录你的想法...'
}: TextEditorProps) {
  const [content, setContent] = useState(initialValue);
  
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    setContent(newText);
    
    // This will be executed after state update
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 0);
  };
  
  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('**', '**')}
          title="加粗"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('*', '*')}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('# ')}
          title="标题1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('## ')}
          title="标题2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('- ')}
          title="无序列表"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('1. ')}
          title="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('`', '`')}
          title="代码"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => insertMarkdown('> ')}
          title="引用"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="border-0 rounded-none min-h-[200px] resize-y"
      />
      
      <div className="p-2 flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}