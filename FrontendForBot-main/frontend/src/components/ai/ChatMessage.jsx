import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Normalize/dedent text so lines with a common leading indent (e.g. 4 spaces)
 * render correctly as lists/paragraphs rather than code blocks.
 *
 * Strategy:
 * - If text contains fenced code blocks (```), leave it as-is (do not dedent).
 * - Otherwise compute the minimum leading-space count among lines that begin with spaces,
 *   and remove that many spaces from every line that has them.
 *
 * This makes outputs like your example render properly:
 *     **Assessment (`/assessment`):** ...
 * (without turning that block into a code block).
 */
const normalizeIndentation = (text = '') => {
  if (!text) return '';

  // preserve fenced codeblocks unchanged
  if (text.includes('```')) return text;

  // convert tabs to spaces for consistent handling
  const normalized = text.replace(/\t/g, '    ');
  const lines = normalized.split('\n');

  // find min leading spaces among lines that have leading spaces
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const m = line.match(/^ +/);
    if (m) {
      minIndent = Math.min(minIndent, m[0].length);
    }
  }

  // if no lines had leading spaces, or minIndent is infinite, nothing to do
  if (!isFinite(minIndent) || minIndent === 0) return text;

  // safety: if minIndent is huge ( > 8 ), assume it's intentional formatting (skip)
  if (minIndent > 8) return text;

  // remove the common leading indent from each line that has it
  const dedented = lines
    .map(l => (l.startsWith(' '.repeat(minIndent)) ? l.slice(minIndent) : l))
    .join('\n');

  return dedented;
};

const MarkdownRenderer = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      // style links to brand blue and open in new tab
      a: ({ node, ...props }) => <a {...props} className="underline text-[#2563EB]" target="_blank" rel="noreferrer" />,
      p: ({ node, ...props }) => <p className="mb-2 text-sm leading-relaxed" {...props} />,
      ul: ({ node, ...props }) => <ul className="list-disc ml-5 space-y-1 mb-2" {...props} />,
      ol: ({ node, ...props }) => <ol className="list-decimal ml-5 space-y-1 mb-2" {...props} />,
      code: ({ node, inline, className, children, ...props }) => {
        return inline ? (
          <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>
        ) : (
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>{children}</code></pre>
        );
      },
      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />
    }}
  >
    {text}
  </ReactMarkdown>
);

const ChatMessage = ({ msg, isUser = false }) => {
  const raw = msg?.parts?.[0]?.text || '';
  const text = normalizeIndentation(raw);

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {/* avatar */}
      {!isUser ? (
        <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-[#2563EB]" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-6 h-6 text-gray-700" />
        </div>
      )}

      <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser ? 'bg-white text-gray-800 rounded-br-none' : 'bg-white/95 text-gray-900 rounded-bl-none border border-white/30'}`}>
        <div className="mb-1 text-xs text-gray-400">{!isUser ? 'AI Assistant' : 'You'}</div>

        <div className="chat-markdown">
          <MarkdownRenderer text={text} />
        </div>

        {/* quick-action suggestions (autodetect internal paths and show buttons) */}
        {!isUser && (
          <div className="mt-3 flex flex-wrap gap-2">
            {text.includes('/assessment') && (
              <Link to="/assessment" className="inline-block">
                <button className="chat-cta">Take Assessment</button>
              </Link>
            )}
            {text.includes('/dashboard') && (
              <Link to="/dashboard" className="inline-block">
                <button className="chat-cta">Open Dashboard</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
