import React from 'react';
import { Bot, User as UserIcon } from 'lucide-react';

/**
 * Simple renderer that:
 * - Converts bullet lines starting with '*' or '-' into <ul><li>
 * - Autolinks URLs starting with http(s) or paths starting with '/'
 * - Preserves newlines as <br/>
 *
 * NOTE: This uses minimal safe replacements (not a full markdown parser).
 */
const formatMessageHtml = (text = '') => {
  // escape HTML special chars to avoid XSS (we will re-insert limited safe tags)
  const escapeHtml = (s) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  let escaped = escapeHtml(text);

  // simple autolink: http(s)://...
  escaped = escaped.replace(
    /(https?:\/\/[^\s]+)/g,
    (m) =>
      `<a href="${m}" target="_blank" rel="noopener noreferrer" class="underline text-[#2563EB]">${m}</a>`
  );

  // simple internal path link: /assessment or /dashboard
  // Note: these are normal anchors (client-side router will still handle them if configured)
  escaped = escaped.replace(
    /(^|\s)(\/[A-Za-z0-9-/_]+)/g,
    (full, pre, path) => `${pre}<a href="${path}" class="underline text-[#2563EB]">${path}</a>`
  );

  // convert bullet lists: lines starting with * or - into <ul><li>
  const lines = escaped.split('\n');
  let inList = false;
  const out = lines.map((line) => {
    const trimmed = line.trim();
    if (/^(\*|-)\s+/.test(trimmed)) {
      const content = trimmed.replace(/^(\*|-)\s+/, '');
      if (!inList) {
        inList = true;
        return `<ul class="ml-4 list-disc space-y-1"><li>${content}</li>`;
      } else {
        return `<li>${content}</li>`;
      }
    } else {
      if (inList) {
        inList = false;
        // close list then render paragraph (escape already done)
        return `</ul><p>${line}</p>`;
      } else {
        // normal line -> wrap; keep blank lines as <br/>
        if (trimmed === '') return '<br/>';
        return `<p>${line}</p>`;
      }
    }
  });

  let result = out.join('');
  if (inList) result += '</ul>';
  return result;
};

const ChatMessage = ({ msg, isUser = false }) => {
  // msg.parts[0].text expected
  const text = msg?.parts?.[0]?.text || '';
  const html = formatMessageHtml(text);

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

      <div
        className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser ? 'bg-white text-gray-800 rounded-br-none' : 'bg-white/95 text-gray-900 rounded-bl-none border border-white/40'}`}
      >
        <div className="mb-1 text-xs text-gray-400">{!isUser ? 'AI Assistant' : 'You'}</div>

        {/* wrap generated HTML in the chat-markdown class (styles live in index.css) */}
        <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: html }} />

      </div>
    </div>
  );
};

export default ChatMessage;
