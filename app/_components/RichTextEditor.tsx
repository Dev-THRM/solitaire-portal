'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Code2,
  Eye,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  onUploadImage,
  placeholder = 'Write your article here...',
  minHeight = 360,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(false);
  const [linkNoFollow, setLinkNoFollow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Suggested internal links for SEO
  const INTERNAL_LINKS = [
    { label: 'All Jobs Listing', url: '/jobs' },
    { label: 'Hospitality & Household Services', url: '/#services' },
    { label: 'About Solitaire', url: '/#about' },
    { label: 'Why Solitaire HR', url: '/#why-us' },
    { label: 'Contact Us', url: '/#contact' },
    { label: 'All Insights & Blogs', url: '/blogs' },
  ];

  // Initialize content on load
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function saveCurrentSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  }

  function restoreSelection() {
    if (savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
  }

  function executeCommand(command: string, value: string | undefined = undefined) {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
  }

  function formatBlock(tag: string) {
    executeCommand('formatBlock', tag);
  }

  // Link Handling
  function openLinkModal() {
    saveCurrentSelection();
    const sel = window.getSelection();
    const text = sel ? sel.toString() : '';
    setLinkText(text);
    setLinkUrl('');
    setLinkOpenNewTab(false);
    setLinkNoFollow(false);
    setShowLinkModal(true);
  }

  function insertLink() {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }
    restoreSelection();
    editorRef.current?.focus();

    let targetAttr = linkOpenNewTab ? ' target="_blank"' : '';
    let relAttr = linkNoFollow ? ' rel="nofollow noopener noreferrer"' : linkOpenNewTab ? ' rel="noopener noreferrer"' : '';
    const displayText = linkText.trim() || linkUrl.trim();
    const linkHtml = `<a href="${linkUrl.trim()}"${targetAttr}${relAttr} class="blog-internal-link">${displayText}</a>`;

    document.execCommand('insertHTML', false, linkHtml);
    handleInput();
    setShowLinkModal(false);
  }

  // Image Handling
  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onUploadImage) {
      try {
        setImageUploading(true);
        const url = await onUploadImage(file);
        restoreSelection();
        editorRef.current?.focus();
        const imgHtml = `<figure style="margin: 24px 0;"><img src="${url}" alt="${file.name.replace(/\.[^.]+$/, '')}" style="max-width: 100%; height: auto; border-radius: 12px;" /><figcaption style="font-size: 13px; color: #64748b; text-align: center; margin-top: 8px;">${file.name.replace(/\.[^.]+$/, '')}</figcaption></figure><p><br/></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleInput();
      } catch (err) {
        alert('Failed to upload image. Please try again.');
      } finally {
        setImageUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  }

  function insertImageUrl() {
    if (!imageUrl.trim()) {
      setShowImageModal(false);
      return;
    }
    restoreSelection();
    editorRef.current?.focus();
    const alt = imageAlt.trim() || 'Blog illustration';
    const imgHtml = `<figure style="margin: 24px 0;"><img src="${imageUrl.trim()}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 12px;" /><figcaption style="font-size: 13px; color: #64748b; text-align: center; margin-top: 8px;">${alt}</figcaption></figure><p><br/></p>`;
    document.execCommand('insertHTML', false, imgHtml);
    handleInput();
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  }

  // Calculate words and characters
  const plainText = (value || '').replace(/<[^>]+>/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '16px',
      background: 'white',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* Trix-style Toolbar */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid var(--color-border)',
        padding: '8px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px',
      }}>
        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: '2px', paddingRight: '8px', borderRight: '1px solid #e2e8f0' }}>
          <button
            type="button"
            title="Undo"
            onClick={() => executeCommand('undo')}
            style={toolbarBtnStyle}
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => executeCommand('redo')}
            style={toolbarBtnStyle}
          >
            <Redo size={15} />
          </button>
        </div>

        {/* Headings */}
        <div style={{ display: 'flex', gap: '2px', paddingRight: '8px', borderRight: '1px solid #e2e8f0' }}>
          <button
            type="button"
            title="Heading 2"
            onClick={() => formatBlock('<h2>')}
            style={toolbarBtnStyle}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => formatBlock('<h3>')}
            style={toolbarBtnStyle}
          >
            <Heading3 size={16} />
          </button>
          <button
            type="button"
            title="Normal Paragraph"
            onClick={() => formatBlock('<p>')}
            style={{ ...toolbarBtnStyle, fontSize: 13, fontWeight: 600, padding: '4px 8px' }}
          >
            ¶
          </button>
        </div>

        {/* Inline Formatting */}
        <div style={{ display: 'flex', gap: '2px', paddingRight: '8px', borderRight: '1px solid #e2e8f0' }}>
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand('bold')}
            style={toolbarBtnStyle}
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand('italic')}
            style={toolbarBtnStyle}
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand('underline')}
            style={toolbarBtnStyle}
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => executeCommand('strikeThrough')}
            style={toolbarBtnStyle}
          >
            <Strikethrough size={15} />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div style={{ display: 'flex', gap: '2px', paddingRight: '8px', borderRight: '1px solid #e2e8f0' }}>
          <button
            type="button"
            title="Bullet List"
            onClick={() => executeCommand('insertUnorderedList')}
            style={toolbarBtnStyle}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => executeCommand('insertOrderedList')}
            style={toolbarBtnStyle}
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            title="Quote"
            onClick={() => formatBlock('<blockquote>')}
            style={toolbarBtnStyle}
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            title="Divider Line"
            onClick={() => executeCommand('insertHorizontalRule')}
            style={toolbarBtnStyle}
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Linking & Media (SEO Focus) */}
        <div style={{ display: 'flex', gap: '4px', paddingRight: '8px', borderRight: '1px solid #e2e8f0' }}>
          <button
            type="button"
            title="Insert Link (Internal/External SEO)"
            onClick={openLinkModal}
            style={{
              ...toolbarBtnStyle,
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <LinkIcon size={14} /> Link
          </button>
          <button
            type="button"
            title="Remove Link"
            onClick={() => executeCommand('unlink')}
            style={toolbarBtnStyle}
          >
            <Unlink size={15} />
          </button>
          <button
            type="button"
            title="Upload Image"
            onClick={() => {
              saveCurrentSelection();
              fileInputRef.current?.click();
            }}
            disabled={imageUploading}
            style={{
              ...toolbarBtnStyle,
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1px solid #bbf7d0',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ImageIcon size={14} /> {imageUploading ? 'Uploading...' : 'Image'}
          </button>
        </div>

        {/* HTML Source Toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            title={isSourceMode ? 'Switch to Visual Mode' : 'View / Edit HTML Source'}
            onClick={() => {
              if (isSourceMode && editorRef.current) {
                editorRef.current.innerHTML = value;
              }
              setIsSourceMode(!isSourceMode);
            }}
            style={{
              ...toolbarBtnStyle,
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 500,
              gap: 4,
              color: isSourceMode ? 'white' : '#475569',
              background: isSourceMode ? '#1e293b' : 'transparent',
            }}
          >
            {isSourceMode ? <Eye size={13} /> : <Code2 size={13} />}
            {isSourceMode ? 'Visual' : 'HTML'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isSourceMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type or paste raw HTML here..."
          style={{
            width: '100%',
            minHeight: `${minHeight}px`,
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            background: '#0f172a',
            color: '#e2e8f0',
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: '750px',
            overflowY: 'auto',
            padding: '24px 28px',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#1e293b',
            outline: 'none',
          }}
          className="blog-editor-content"
        />
      )}

      {/* Editor Footer / SEO Stats */}
      <div style={{
        background: '#f8fafc',
        borderTop: '1px solid var(--color-border)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span><strong>{wordCount}</strong> words</span>
          <span><strong>{readTimeEst}</strong> min read</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={13} color="#2563eb" />
          <span style={{ color: '#2563eb', fontWeight: 500 }}>SEO Friendly Editor</span>
        </div>
      </div>

      {/* ── Link Modal with SEO Internal Linking Picker ── */}
      {showLinkModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <LinkIcon size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Insert Link for SEO</h3>
                <p style={{ fontSize: 13, color: '#64748b' }}>Link to internal jobs, services, or high-authority external sources</p>
              </div>
            </div>

            {/* Quick Internal Links */}
            <div style={{ marginBottom: 18, background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
                Suggested Internal SEO Links:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {INTERNAL_LINKS.map((link) => (
                  <button
                    key={link.url}
                    type="button"
                    onClick={() => {
                      setLinkUrl(link.url);
                      if (!linkText) setLinkText(link.label);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: linkUrl === link.url ? '#2563eb' : 'white',
                      color: linkUrl === link.url ? 'white' : '#334155',
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Target URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://... or /jobs or /#services"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="input"
                  style={{ width: '100%', borderRadius: 10 }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Anchor Text (Text to display)
                </label>
                <input
                  type="text"
                  placeholder="e.g. explore luxury butler roles"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="input"
                  style={{ width: '100%', borderRadius: 10 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={linkOpenNewTab}
                    onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  />
                  Open in a new tab (target=&quot;_blank&quot;)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={linkNoFollow}
                    onChange={(e) => setLinkNoFollow(e.target.checked)}
                  />
                  Add rel=&quot;nofollow&quot; (for external or sponsor links)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="btn btn-secondary"
                style={{ borderRadius: 10, padding: '8px 18px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="btn btn-primary"
                style={{ borderRadius: 10, padding: '8px 22px' }}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  color: '#475569',
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
};
