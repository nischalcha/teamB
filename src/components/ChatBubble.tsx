'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { IoChatbubbleEllipsesOutline, IoClose, IoTrashOutline } from 'react-icons/io5';
import { IoIosFlash } from 'react-icons/io';
import type { AuthUser } from '@/lib/auth';

const BOT_NAME = 'Flash Sports Assistant';
const WELCOME_MESSAGE = `Hi! I'm your Flash Sports Academy assistant. You can ask me about:
• Court availability (e.g. "Is there availability tomorrow?")
• Booking a court
• Services & pricing
• Upcoming events & players
• Contact & locations

Type your question below or pick a quick option.`;

const QUICK_OPTIONS = [
  { label: 'Check availability', href: '/availability', reply: 'You can see real-time court availability and book a slot on our availability page. Sign in to book.' },
  { label: 'Book a court', href: '/availability', reply: 'Book a court on our availability page—pick location, date, and time. You’ll need to sign in to complete the booking.' },
  { label: 'Our services & pricing', href: '/', reply: 'Adults: NPR 12,000/month (morning group). Kids: NPR 1,000/hour (evening). Full details are on the home page.' },
  { label: 'Upcoming events', href: '/', reply: 'Our upcoming events are listed on the home page. Scroll to the events section to see dates and locations.' },
  { label: 'Players & roster', href: '/players', reply: 'Meet our players on the Players page. You can filter by age and see profiles and achievements.' },
  { label: 'Contact & locations', href: '/', reply: 'We’re at Baluwatar and Budhanilkantha. Instagram and Facebook links are in the footer. The map is there too!' },
] as const;

type AvailabilitySlot = { courtType: string; timeSlot: string; available: number };
type LocationAvailability = { id: number; name: string; slots: AvailabilitySlot[] };
type AvailabilityData = { date: string; locations: LocationAvailability[] };

type Message = {
  role: 'bot' | 'user';
  text: string;
  optionLabel?: string;
  linkHref?: string;
  linkLabel?: string;
  isHtml?: boolean;
  availability?: AvailabilityData;
};

const SAFE_HREF = /^(\.\.?\/|[#]|mailto:)/;

/** Allowlist sanitizer for chat HTML: only p, br, ul, ol, li, strong, b, em, a (href / or #). Works in SSR and client. */
function sanitizeChatHtml(html: string): string {
  // Strip script and style and any on* attributes
  let out = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  // Only allow safe tags; strip others (replace with inner text conceptually via a simple pass)
  if (typeof document !== 'undefined') {
    const doc = new DOMParser().parseFromString(out, 'text/html');
    const allowed = new Set(['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'a']);
    function go(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      if (!allowed.has(tag)) return Array.from(el.childNodes).map(go).join('');
      if (tag === 'br') return '<br>';
      let attrs = '';
      if (tag === 'a') {
        const href = el.getAttribute('href');
        if (href && (SAFE_HREF.test(href) || (typeof window !== 'undefined' && new URL(href, window.location.origin).origin === window.location.origin))) {
          attrs = ` href="${href.replace(/"/g, '&quot;')}"`;
        }
      }
      return `<${tag}${attrs}>${Array.from(el.childNodes).map(go).join('')}</${tag}>`;
    }
    return Array.from(doc.body.childNodes).map(go).join('');
  }
  // SSR / no DOM: return stripped tags so we can show plain text until client mounts and can sanitize properly.
  return out.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || out;
}

function stripHtmlToText(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const COURT_LABELS: Record<string, string> = { clay: 'Clay', mini: 'Mini' };

interface ChatBubbleProps {
  user?: AuthUser | null;
}

export function ChatBubble({ user }: ChatBubbleProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: WELCOME_MESSAGE }]);
  const [showOptions, setShowOptions] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = !!user;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-chat-toggle]')) setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function clearChat() {
    setMessages([{ role: 'bot', text: WELCOME_MESSAGE }]);
    setShowOptions(true);
    setInput('');
  }

  async function handleBookSlot(locationId: number, locationName: string, courtType: string, date: string, timeSlot: string) {
    const key = `${locationId}-${courtType}-${date}-${timeSlot}`;
    if (bookingSlot === key || !isLoggedIn) return;
    setBookingSlot(key);
    try {
      const res = await fetch('/api/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ locationId, courtType, date, timeSlot }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: data.success ? `Booked! ${data.message}` : data.message || 'Booking failed.' },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setBookingSlot(null);
    }
  }

  async function handleOptionClick(option: (typeof QUICK_OPTIONS)[number]) {
    setShowOptions(false);
    const linkLabel = option.href === '/availability' ? 'Go to availability' : option.href === '/players' ? 'View players' : 'Go to home';
    const isAvailabilityOrBook = option.label === 'Check availability' || option.label === 'Book a court';
    if (isAvailabilityOrBook) {
      setMessages((prev) => [...prev, { role: 'user', text: option.label, optionLabel: option.label }]);
      setSending(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: option.label }),
        });
        const data = await res.json();
        const reply = data?.reply ?? option.reply;
        const availability = data?.availability as AvailabilityData | undefined;
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: reply, linkHref: option.href, linkLabel, availability },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: option.reply, linkHref: option.href, linkLabel },
        ]);
      } finally {
        setSending(false);
      }
      return;
    }
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: option.label, optionLabel: option.label },
      { role: 'bot', text: option.reply, linkHref: option.href, linkLabel },
    ]);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setShowOptions(false);
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data?.reply ?? 'Sorry, I couldn’t process that. Try asking about availability, booking, or pricing.';
      const link = data?.link;
      const isHtml = data?.format === 'html';
      const availability = data?.availability as AvailabilityData | undefined;
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: reply,
          linkHref: link?.href,
          linkLabel: link?.label,
          isHtml,
          availability,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Try again or use the quick options.', linkHref: '/availability', linkLabel: 'Book a court' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        data-chat-toggle
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg transition-all hover:scale-105 hover:bg-primary hover:text-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <IoClose className="h-7 w-7" /> : <IoChatbubbleEllipsesOutline className="h-7 w-7 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-[99] flex h-[420px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl sm:h-[480px] sm:w-[380px]"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-primary/15 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
              <IoIosFlash className="h-5 w-5 text-black" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold uppercase tracking-tight text-black">{BOT_NAME}</p>
              <p className="truncate text-xs text-black/60">Here to help with bookings & info</p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              className="shrink-0 rounded-lg p-2 text-black/60 transition-colors hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <IoTrashOutline className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-black border border-black/10'
                  }`}
                >
                  {m.role === 'bot' ? (
                    m.isHtml ? (
                      mounted ? (
                        <div
                          className="chat-reply-html [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_a]:text-primary [&_a]:underline [&_a]:font-medium first:[&_p]:mt-0 last:[&_p]:mb-0"
                          dangerouslySetInnerHTML={{ __html: sanitizeChatHtml(m.text) }}
                        />
                      ) : (
                        <p className="whitespace-pre-line">{stripHtmlToText(m.text)}</p>
                      )
                    ) : i === 0 ? (
                      <p className="whitespace-pre-line font-medium">{m.text}</p>
                    ) : (
                      <p className="whitespace-pre-line">{m.text}</p>
                    )
                  ) : (
                    <p className="whitespace-pre-line">{m.text}</p>
                  )}
                  {m.role === 'bot' && m.linkHref && m.linkLabel && (
                    <Link
                      href={m.linkHref}
                      className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                    >
                      {m.linkLabel} →
                    </Link>
                  )}
                  {m.role === 'bot' && m.availability && m.availability.locations.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-black/10 pt-2">
                      <p className="text-xs font-semibold text-black/70">Available slots ({m.availability.date})</p>
                      {m.availability.locations.map((loc) => (
                        <div key={loc.id} className="space-y-1">
                          <p className="text-xs font-medium text-black/80">{loc.name}</p>
                          <div className="flex flex-wrap gap-1">
                            {loc.slots
                              .filter((s) => s.available > 0)
                              .slice(0, 8)
                              .map((s) => {
                                const key = `${loc.id}-${s.courtType}-${m.availability!.date}-${s.timeSlot}`;
                                const loading = bookingSlot === key;
                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    disabled={!isLoggedIn || loading}
                                    onClick={() => handleBookSlot(loc.id, loc.name, s.courtType, m.availability!.date, s.timeSlot)}
                                    className="rounded-md border border-black/20 bg-white px-2 py-1 text-xs font-medium text-black transition-colors hover:border-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={isLoggedIn ? `Book ${COURT_LABELS[s.courtType] || s.courtType} ${s.timeSlot}` : 'Sign in to book'}
                                  >
                                    {COURT_LABELS[s.courtType] || s.courtType} {s.timeSlot}
                                    {isLoggedIn ? (loading ? ' …' : ' · Book') : ''}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                      {!isLoggedIn && (
                        <p className="text-xs text-black/60">
                          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link> to book a slot.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick options - show only when no user messages yet or as a hint */}
            {showOptions && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-black/50">Quick options</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleOptionClick(opt)}
                      className="inline-flex items-center rounded-full border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:border-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-black/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about availability, booking, pricing..."
                className="min-w-0 flex-1 rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/40 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={sending}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
              >
                {sending ? '…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
