"use client";
import React, { useEffect, useRef, useCallback } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const ToolbarBtn = ({
    onClick,
    title,
    icon,
    active,
}: {
    onClick: () => void;
    title: string;
    icon: React.ReactNode;
    active?: boolean;
}) => (
    <button
        type="button"
        title={title}
        onMouseDown={(e) => {
            e.preventDefault(); // keep editor focus
            onClick();
        }}
        className={`p-2 rounded-xl transition-all text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:scale-95
      ${active ? "bg-blue-100 text-blue-700" : ""}`}
    >
        {icon}
    </button>
);

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write a rich description…",
    minHeight = "180px",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);

    // Sync external value → editor (without clobbering cursor)
    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        // Only update DOM if content actually differs (avoid cursor jump on every keystroke)
        if (el.innerHTML !== value && !isInternalChange.current) {
            el.innerHTML = value;
        }
        isInternalChange.current = false;
    }, [value]);

    const exec = useCallback((cmd: string, arg?: string) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, arg);
        const html = editorRef.current?.innerHTML ?? "";
        isInternalChange.current = true;
        onChange(html);
    }, [onChange]);

    const handleInput = () => {
        isInternalChange.current = true;
        onChange(editorRef.current?.innerHTML ?? "");
    };

    return (
        <div className="rounded-2xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden bg-white">
            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                {/* Text style */}
                <ToolbarBtn title="Bold (Ctrl+B)" onClick={() => exec("bold")} icon={<span className="font-black text-sm w-5 text-center">B</span>} />
                <ToolbarBtn title="Italic (Ctrl+I)" onClick={() => exec("italic")} icon={<span className="italic text-sm w-5 text-center font-semibold">I</span>} />
                <ToolbarBtn title="Underline (Ctrl+U)" onClick={() => exec("underline")} icon={<span className="underline text-sm w-5 text-center font-semibold">U</span>} />
                <ToolbarBtn title="Strikethrough" onClick={() => exec("strikeThrough")} icon={<span className="line-through text-sm w-5 text-center text-slate-500">S</span>} />

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Headings */}
                <ToolbarBtn title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} icon={<span className="text-[11px] font-black w-6 text-center">H2</span>} />
                <ToolbarBtn title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} icon={<span className="text-[11px] font-black w-6 text-center">H3</span>} />
                <ToolbarBtn title="Normal paragraph" onClick={() => exec("formatBlock", "<p>")} icon={<span className="text-[11px] font-semibold w-6 text-center">¶</span>} />

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Lists */}
                <ToolbarBtn title="Bullet list" onClick={() => exec("insertUnorderedList")} icon={
                    <svg viewBox="0 0 18 14" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="2" cy="2.5" r="1.5" fill="currentColor" stroke="none" />
                        <circle cx="2" cy="7" r="1.5" fill="currentColor" stroke="none" />
                        <circle cx="2" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
                        <line x1="6" y1="2.5" x2="17" y2="2.5" />
                        <line x1="6" y1="7" x2="17" y2="7" />
                        <line x1="6" y1="11.5" x2="17" y2="11.5" />
                    </svg>
                } />
                <ToolbarBtn title="Numbered list" onClick={() => exec("insertOrderedList")} icon={
                    <svg viewBox="0 0 18 14" className="w-4 h-4" fill="currentColor">
                        <text x="0" y="4" fontSize="4.5" fontWeight="bold">1.</text>
                        <text x="0" y="8.5" fontSize="4.5" fontWeight="bold">2.</text>
                        <text x="0" y="13" fontSize="4.5" fontWeight="bold">3.</text>
                        <line x1="7" y1="2.5" x2="17" y2="2.5" stroke="currentColor" strokeWidth="1.8" />
                        <line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.8" />
                        <line x1="7" y1="11.5" x2="17" y2="11.5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                } />

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Indent */}
                <ToolbarBtn title="Indent" onClick={() => exec("indent")} icon={
                    <svg viewBox="0 0 18 14" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="1" y1="2" x2="17" y2="2" />
                        <line x1="5" y1="7" x2="17" y2="7" />
                        <line x1="5" y1="12" x2="17" y2="12" />
                        <path d="M1 5.5 L4 7 L1 8.5Z" fill="currentColor" stroke="none" />
                    </svg>
                } />
                <ToolbarBtn title="Outdent" onClick={() => exec("outdent")} icon={
                    <svg viewBox="0 0 18 14" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="1" y1="2" x2="17" y2="2" />
                        <line x1="5" y1="7" x2="17" y2="7" />
                        <line x1="5" y1="12" x2="17" y2="12" />
                        <path d="M4 5.5 L1 7 L4 8.5Z" fill="currentColor" stroke="none" />
                    </svg>
                } />

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Align */}
                <ToolbarBtn title="Align left" onClick={() => exec("justifyLeft")} icon={
                    <svg viewBox="0 0 16 14" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="1" y1="2" x2="15" y2="2" /><line x1="1" y1="6" x2="10" y2="6" />
                        <line x1="1" y1="10" x2="15" y2="10" /><line x1="1" y1="14" x2="10" y2="14" />
                    </svg>
                } />
                <ToolbarBtn title="Align center" onClick={() => exec("justifyCenter")} icon={
                    <svg viewBox="0 0 16 14" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="1" y1="2" x2="15" y2="2" /><line x1="3.5" y1="6" x2="12.5" y2="6" />
                        <line x1="1" y1="10" x2="15" y2="10" /><line x1="3.5" y1="14" x2="12.5" y2="14" />
                    </svg>
                } />

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Clear */}
                <ToolbarBtn title="Clear formatting" onClick={() => exec("removeFormat")} icon={
                    <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 14l4-10h2l4 10M6.5 10h5" /><line x1="14" y1="3" x2="16" y2="5" strokeLinecap="round" />
                        <line x1="16" y1="3" x2="14" y2="5" strokeLinecap="round" />
                    </svg>
                } />
            </div>

            {/* ── Editor area ── */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                data-placeholder={placeholder}
                style={{ minHeight }}
                className={`
          px-5 py-4 outline-none text-slate-700 leading-relaxed text-sm
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-2 [&_h2]:mb-1
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-700 [&_h3]:mt-2 [&_h3]:mb-1
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
          [&_li]:mb-1
          [&_strong]:font-bold
          [&_em]:italic
          [&_u]:underline
          [&_s]:line-through
          [&_p]:mb-2
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none
        `}
            />
        </div>
    );
}
