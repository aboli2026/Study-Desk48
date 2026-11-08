import React from 'react';

/**
 * Applies Markdown and inline styling to a textarea based on user selection
 */
export function applyStickyFormatting(
  textarea: HTMLTextAreaElement | null,
  content: string,
  setContent: (val: string) => void,
  action: string,
  param?: string
) {
  if (!textarea) return;

  const start = textarea.selectionStart ?? content.length;
  const end = textarea.selectionEnd ?? content.length;
  const selectedText = content.substring(start, end);
  const beforeText = content.substring(0, start);
  const afterText = content.substring(end);

  let replacement = '';
  let cursorStart = start;
  let cursorEnd = end;

  switch (action) {
    case 'bold':
      if (selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4) {
        replacement = selectedText.slice(2, -2);
        cursorStart = start;
        cursorEnd = start + replacement.length;
      } else {
        replacement = `**${selectedText || 'متن ضخیم'}**`;
        cursorStart = start + 2;
        cursorEnd = cursorStart + (selectedText ? selectedText.length : 9);
      }
      break;

    case 'italic':
      if (selectedText.startsWith('*') && selectedText.endsWith('*') && selectedText.length >= 2) {
        replacement = selectedText.slice(1, -1);
        cursorStart = start;
        cursorEnd = start + replacement.length;
      } else {
        replacement = `*${selectedText || 'متن مورب'}*`;
        cursorStart = start + 1;
        cursorEnd = cursorStart + (selectedText ? selectedText.length : 9);
      }
      break;

    case 'underline':
      if (selectedText.startsWith('<u>') && selectedText.endsWith('</u>')) {
        replacement = selectedText.slice(3, -4);
        cursorStart = start;
        cursorEnd = start + replacement.length;
      } else {
        replacement = `<u>${selectedText || 'متن زیرخط'}</u>`;
        cursorStart = start + 3;
        cursorEnd = cursorStart + (selectedText ? selectedText.length : 10);
      }
      break;

    case 'strikethrough':
      if (selectedText.startsWith('~~') && selectedText.endsWith('~~') && selectedText.length >= 4) {
        replacement = selectedText.slice(2, -2);
        cursorStart = start;
        cursorEnd = start + replacement.length;
      } else {
        replacement = `~~${selectedText || 'متن خط‌خورده'}~~`;
        cursorStart = start + 2;
        cursorEnd = cursorStart + (selectedText ? selectedText.length : 14);
      }
      break;

    case 'highlight':
      const hlColor = param || '#fef08a';
      replacement = `<mark style="background-color: ${hlColor};">${selectedText || 'متن هایلایت'}</mark>`;
      cursorStart = start + replacement.indexOf('>') + 1;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 11);
      break;

    case 'textColor':
      const colorVal = param || '#dc2626';
      replacement = `<span style="color: ${colorVal};">${selectedText || 'متن رنگی'}</span>`;
      cursorStart = start + replacement.indexOf('>') + 1;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 9);
      break;

    case 'h1': {
      // Find beginning of current line
      const lastNewline = beforeText.lastIndexOf('\n');
      const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
      const currentLinePrefix = beforeText.substring(lineStart);
      if (currentLinePrefix.startsWith('# ')) {
        // Toggle off
        const newBefore = beforeText.substring(0, lineStart) + currentLinePrefix.slice(2);
        setContent(newBefore + selectedText + afterText);
        return;
      }
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '# ' : '\n# ';
      replacement = `${prefix}${selectedText || 'عنوان اصلی'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 10);
      break;
    }

    case 'h2': {
      const lastNewline = beforeText.lastIndexOf('\n');
      const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
      const currentLinePrefix = beforeText.substring(lineStart);
      if (currentLinePrefix.startsWith('## ')) {
        const newBefore = beforeText.substring(0, lineStart) + currentLinePrefix.slice(3);
        setContent(newBefore + selectedText + afterText);
        return;
      }
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '## ' : '\n## ';
      replacement = `${prefix}${selectedText || 'عنوان فرعی'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 10);
      break;
    }

    case 'bullet': {
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '• ' : '\n• ';
      replacement = `${prefix}${selectedText || 'نکته مهم'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 8);
      break;
    }

    case 'numbered': {
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '1. ' : '\n1. ';
      replacement = `${prefix}${selectedText || 'مورد اول'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 8);
      break;
    }

    case 'task': {
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '[ ] ' : '\n[ ] ';
      replacement = `${prefix}${selectedText || 'کار برای انجام'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 14);
      break;
    }

    case 'quote': {
      const prefix = beforeText.length === 0 || beforeText.endsWith('\n') ? '> ' : '\n> ';
      replacement = `${prefix}${selectedText || 'نقل قول کلیدی'}\n`;
      cursorStart = start + prefix.length;
      cursorEnd = cursorStart + (selectedText ? selectedText.length : 13);
      break;
    }

    default:
      return;
  }

  const updatedContent = beforeText + replacement + afterText;
  setContent(updatedContent);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

/**
 * Parses inline formatting tags: bold, italic, underline, strike, highlight, and color spans
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex pattern matching:
  // 1. <mark style="background-color: (.*?)">(.*?)</mark>
  // 2. <span style="color: (.*?)">(.*?)</span>
  // 3. <u>(.*?)</u>
  // 4. **(.*?)**
  // 5. *(.*?) *
  // 6. ~~(.*?)~~
  // 7. ==(.*?)==
  const tokenRegex = /(<mark style="background-color:\s*([^"]+)">([\s\S]*?)<\/mark>|<span style="color:\s*([^"]+)">([\s\S]*?)<\/span>|<u>([\s\S]*?)<\/u>|\*\*([\s\S]*?)\*\*|==([\s\S]*?)==|~~([\s\S]*?)~~|\*([^*\n]+)\*)/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const [
      ,
      ,
      markColor,
      markText,
      spanColor,
      spanText,
      underlineText,
      boldText,
      highlightText,
      strikeText,
      italicText,
    ] = match;

    const key = `token-${match.index}`;

    if (markColor && markText !== undefined) {
      parts.push(
        <mark
          key={key}
          style={{ backgroundColor: markColor }}
          className="px-1.5 py-0.5 rounded-md font-semibold text-neutral-950 inline-block my-0.5"
        >
          {parseInlineFormatting(markText)}
        </mark>
      );
    } else if (spanColor && spanText !== undefined) {
      parts.push(
        <span key={key} style={{ color: spanColor }} className="font-bold">
          {parseInlineFormatting(spanText)}
        </span>
      );
    } else if (underlineText !== undefined) {
      parts.push(
        <span key={key} className="underline decoration-1.5 underline-offset-3 font-semibold">
          {parseInlineFormatting(underlineText)}
        </span>
      );
    } else if (boldText !== undefined) {
      parts.push(
        <strong key={key} className="font-black text-neutral-950">
          {parseInlineFormatting(boldText)}
        </strong>
      );
    } else if (highlightText !== undefined) {
      parts.push(
        <mark
          key={key}
          className="bg-amber-300/90 text-neutral-950 px-1.5 py-0.5 rounded-md font-semibold inline-block my-0.5"
        >
          {parseInlineFormatting(highlightText)}
        </mark>
      );
    } else if (strikeText !== undefined) {
      parts.push(
        <del key={key} className="line-through opacity-70 text-neutral-600">
          {parseInlineFormatting(strikeText)}
        </del>
      );
    } else if (italicText !== undefined) {
      parts.push(
        <em key={key} className="italic opacity-90 font-medium">
          {parseInlineFormatting(italicText)}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Renders sticky note content with rich markdown & layout formatting
 */
export function renderStickyContent(content: string, isBold = false): React.ReactNode {
  if (!content || !content.trim()) {
    return <span className="text-neutral-500 italic">بدون متن</span>;
  }

  const lines = content.split('\n');

  return (
    <div className={`space-y-1.5 w-full text-right ${isBold ? 'font-bold' : 'font-normal'}`} dir="rtl">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Heading 1 (# )
        if (line.startsWith('# ')) {
          return (
            <h3
              key={idx}
              className="text-base sm:text-lg font-black text-neutral-950 mt-2.5 mb-1 pb-1 border-b border-black/10 leading-snug tracking-tight"
            >
              {parseInlineFormatting(line.slice(2))}
            </h3>
          );
        }

        // 2. Heading 2 (## )
        if (line.startsWith('## ')) {
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-extrabold text-neutral-950 mt-2 mb-0.5 leading-snug"
            >
              {parseInlineFormatting(line.slice(3))}
            </h4>
          );
        }

        // 3. Bullet Point (• or - )
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pr-1 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-2" />
              <div className="flex-1 leading-relaxed text-neutral-950 text-xs sm:text-sm">
                {parseInlineFormatting(line.slice(2))}
              </div>
            </div>
          );
        }

        // 4. Numbered List (1. )
        const numMatch = line.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pr-1 my-0.5">
              <span className="font-mono font-bold text-xs text-neutral-800 shrink-0 mt-0.5 min-w-[14px]">
                {numMatch[1]}.
              </span>
              <div className="flex-1 leading-relaxed text-neutral-950 text-xs sm:text-sm">
                {parseInlineFormatting(numMatch[2])}
              </div>
            </div>
          );
        }

        // 5. Checklist Task: Unchecked ([ ] )
        if (line.startsWith('[ ] ')) {
          return (
            <div key={idx} className="flex items-center gap-2 pr-1 my-1">
              <div className="w-4 h-4 rounded-md border-1.5 border-black/50 bg-white/80 shrink-0 shadow-2xs" />
              <div className="flex-1 text-xs sm:text-sm leading-relaxed text-neutral-950">
                {parseInlineFormatting(line.slice(4))}
              </div>
            </div>
          );
        }

        // 6. Checklist Task: Checked ([x] or [X] )
        if (line.startsWith('[x] ') || line.startsWith('[X] ')) {
          return (
            <div key={idx} className="flex items-center gap-2 pr-1 my-1 opacity-70">
              <div className="w-4 h-4 rounded-md bg-neutral-950 text-white shrink-0 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                ✓
              </div>
              <div className="flex-1 text-xs sm:text-sm leading-relaxed text-neutral-800 line-through">
                {parseInlineFormatting(line.slice(4))}
              </div>
            </div>
          );
        }

        // 7. Blockquote (> )
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-r-2 border-neutral-900/50 pr-3 py-1 my-1.5 text-xs sm:text-sm italic text-neutral-900 bg-black/5 rounded-l-xl font-medium"
            >
              {parseInlineFormatting(line.slice(2))}
            </blockquote>
          );
        }

        // 8. Empty lines
        if (trimmed.length === 0) {
          return <div key={idx} className="h-2" />;
        }

        // 9. Standard text line
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-neutral-950 my-0.5 break-words">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}
