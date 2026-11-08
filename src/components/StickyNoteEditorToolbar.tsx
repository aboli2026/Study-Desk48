import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Palette,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Eye,
  Edit3,
} from 'lucide-react';

interface StickyNoteEditorToolbarProps {
  onFormat: (action: string, param?: string) => void;
  activeViewMode: 'edit' | 'preview';
  onChangeViewMode: (mode: 'edit' | 'preview') => void;
  isBoldActive?: boolean;
  onToggleBoldGlobal?: () => void;
}

const HIGHLIGHT_PASTELS = [
  { value: '#fef08a', label: 'زرد', bg: '#fef08a' },
  { value: '#bbf7d0', label: 'سبز', bg: '#bbf7d0' },
  { value: '#fed7aa', label: 'نارنجی', bg: '#fed7aa' },
  { value: '#bae6fd', label: 'آبی', bg: '#bae6fd' },
  { value: '#fecdd3', label: 'صورتی', bg: '#fecdd3' },
];

const TEXT_COLORS = [
  { value: '#000000', label: 'مشکی', bg: '#000000' },
  { value: '#dc2626', label: 'قرمز', bg: '#dc2626' },
  { value: '#2563eb', label: 'آبی', bg: '#2563eb' },
  { value: '#16a34a', label: 'سبز', bg: '#16a34a' },
  { value: '#7c3aed', label: 'بنفش', bg: '#7c3aed' },
];

export const StickyNoteEditorToolbar: React.FC<StickyNoteEditorToolbarProps> = ({
  onFormat,
  activeViewMode,
  onChangeViewMode,
  isBoldActive,
  onToggleBoldGlobal,
}) => {
  const [isHighlightMenuOpen, setIsHighlightMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);

  const highlightMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);

  // Close color popups on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (highlightMenuRef.current && !highlightMenuRef.current.contains(e.target as Node)) {
        setIsHighlightMenuOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
        setIsColorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleAction = (e: React.MouseEvent, action: string, param?: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFormat(action, param);
    setIsHighlightMenuOpen(false);
    setIsColorMenuOpen(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl p-1.5 shadow-xs flex items-center justify-between gap-1 flex-wrap select-none text-neutral-800">
      {/* Left Formatting Group */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {/* Headings */}
        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'h1')}
          className="px-2 py-1 text-xs font-black rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="تیتر اصلی (H1)"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'h2')}
          className="px-2 py-1 text-xs font-extrabold rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="تیتر فرعی (H2)"
        >
          H2
        </button>

        <div className="w-px h-3.5 bg-neutral-200 mx-1" />

        {/* Text Style: Bold, Italic, Underline, Strike */}
        <button
          type="button"
          onMouseDown={(e) => {
            if (onToggleBoldGlobal && e.shiftKey) {
              onToggleBoldGlobal();
            } else {
              handleAction(e, 'bold');
            }
          }}
          className={`p-1.5 rounded-lg cursor-pointer ios-spring-tool transition-colors ${
            isBoldActive
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950'
          }`}
          title="بولد / ضخیم کردن متن (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'italic')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="مورب / ایتالیک (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'underline')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="زیرخط دار (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'strikethrough')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="خط‌خورده (Strikethrough)"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-neutral-200 mx-1" />

        {/* Highlighter Dropdown */}
        <div className="relative" ref={highlightMenuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsHighlightMenuOpen((prev) => !prev);
              setIsColorMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-amber-600 hover:text-amber-700 cursor-pointer ios-spring-tool transition-colors flex items-center gap-1"
            title="هایلایتر متن برگه"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>

          {isHighlightMenuOpen && (
            <div className="absolute top-full mt-1.5 right-0 z-50 bg-white shadow-xl rounded-xl p-2 border border-neutral-200/90 w-40 space-y-1.5 animate-ios-popover-open">
              <span className="text-[10px] font-bold text-neutral-500 block text-right px-1">
                رنگ هایلایتر:
              </span>
              <div className="flex items-center gap-1.5 justify-center">
                {HIGHLIGHT_PASTELS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'highlight', p.value)}
                    style={{ backgroundColor: p.bg }}
                    className="w-5.5 h-5.5 rounded-full border border-black/15 hover:scale-120 transition-transform cursor-pointer shadow-2xs"
                    title={p.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Color Dropdown */}
        <div className="relative" ref={colorMenuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsColorMenuOpen((prev) => !prev);
              setIsHighlightMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-rose-600 hover:text-rose-700 cursor-pointer ios-spring-tool transition-colors flex items-center gap-1"
            title="تغییر رنگ نوشته"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {isColorMenuOpen && (
            <div className="absolute top-full mt-1.5 right-0 z-50 bg-white shadow-xl rounded-xl p-2 border border-neutral-200/90 w-40 space-y-1.5 animate-ios-popover-open">
              <span className="text-[10px] font-bold text-neutral-500 block text-right px-1">
                رنگ متن:
              </span>
              <div className="flex items-center gap-1.5 justify-center">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => handleAction(e, 'textColor', c.value)}
                    style={{ backgroundColor: c.bg }}
                    className="w-5.5 h-5.5 rounded-full border border-black/15 hover:scale-120 transition-transform cursor-pointer shadow-2xs"
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-3.5 bg-neutral-200 mx-1" />

        {/* Lists & Task */}
        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'bullet')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="لیست نقطه‌ای (Bullet)"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'numbered')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="لیست عددی (Numbered)"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'task')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="چک‌لیست / تسک"
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => handleAction(e, 'quote')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 cursor-pointer ios-spring-tool transition-colors"
          title="نقل‌قول (Quote)"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Segmented Mode Switcher: Edit vs Live Preview */}
      <div className="flex items-center gap-1 bg-neutral-100/90 p-0.5 rounded-xl border border-neutral-200/80 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => onChangeViewMode('edit')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
            activeViewMode === 'edit'
              ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="حالت نوشتن و ویرایش"
        >
          <Edit3 className="w-3 h-3" />
          <span>ویرایش</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeViewMode('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
            activeViewMode === 'preview'
              ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="مشاهده پیش‌نمایش آراسته برگه چسبان"
        >
          <Eye className="w-3 h-3" />
          <span>پیش‌نمایش</span>
        </button>
      </div>
    </div>
  );
};
