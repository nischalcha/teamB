import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM',
  '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM',
];

function tomorrowYYYYMMDD(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function todayYYYYMMDD(): string {
  return new Date().toISOString().split('T')[0];
}

async function buildAcademyContext(payload: Awaited<ReturnType<typeof getPayload>>) {
  const [locationsRes, servicesRes, eventsRes, bookingsRes] = await Promise.all([
    payload.find({ collection: 'locations', limit: 10, depth: 0 }),
    payload.find({ collection: 'services', limit: 20, depth: 0 }),
    payload.find({
      collection: 'events',
      limit: 5,
      depth: 0,
      where: { startDate: { greater_than_equal: todayYYYYMMDD() } },
      sort: 'startDate',
    }),
    (async () => {
      const { docs: locs } = await payload.find({ collection: 'locations', limit: 1 });
      if (locs.length === 0) return '';
      const loc = locs[0];
      const date = tomorrowYYYYMMDD();
      const { docs: bookings } = await payload.find({
        collection: 'bookings',
        where: {
          and: [
            { location: { equals: loc.id } },
            { date: { equals: date } },
            { status: { equals: 'confirmed' } },
          ],
        },
        limit: 500,
      });
      const counts: Record<string, number> = {};
      for (const b of bookings) {
        const key = `${b.courtType}::${b.timeSlot}`;
        counts[key] = (counts[key] || 0) + 1;
      }
      const courts = (loc.courts as Array<{ courtType: string; availableSlots: number }>) || [];
      const parts: string[] = [];
      for (const court of courts) {
        const max = court.availableSlots ?? 0;
        for (const slot of TIME_SLOTS) {
          const key = `${court.courtType}::${slot}`;
          const left = Math.max(0, max - (counts[key] || 0));
          if (left > 0) parts.push(`${court.courtType} ${slot}: ${left} left`);
        }
      }
      return `Tomorrow (${date}) at ${loc.name}: ${parts.length > 0 ? parts.slice(0, 6).join('; ') : 'No slots available.'}`;
    })(),
  ]);

  const locations = locationsRes.docs.map((l) => `${l.name}: ${l.address}`).join('\n');
  const services = servicesRes.docs.length > 0
    ? servicesRes.docs.map((s) => `- ${s.name}: NPR ${(s as { price?: number }).price?.toLocaleString()}/${(s as { pricingUnit?: string }).pricingUnit} (${(s as { timing?: string }).timing})`).join('\n')
    : 'Adults: NPR 12,000/month (morning). Kids: NPR 1,000/hour (evening).';
  const events = eventsRes.docs.length > 0
    ? eventsRes.docs.map((e) => `- ${e.title}: ${(e as { startDate?: string }).startDate}`).join('\n')
    : 'No upcoming events listed.';

  return `
## Locations
${locations || 'Baluwatar and Budhanilkantha. Addresses on website.'}

## Services & pricing
${services}

## Upcoming events
${events}

## Availability snapshot (for reference)
${bookingsRes}

## Other
- Booking: users go to the availability page, pick location, date, and time slot, and must sign in to book.
- Players: directory on the Players page with age filter.
- Contact: Instagram and Facebook links and map in the footer.
`.trim();
}

const SYSTEM_INSTRUCTION = `You are the friendly chat assistant for Flash Sports Academy, a tennis academy in Nepal with locations in Baluwatar and Budhanilkantha.

Your role:
1. Answer only questions about Flash Sports Academy: tennis courts, booking, availability, services, pricing, events, players, locations, and contact. Use ONLY the context data provided below—do not invent prices, dates, or addresses.
2. If the user asks something unrelated (e.g. weather, politics, other sports brands, general knowledge), reply politely in one short sentence: "I can only help with questions about Flash Sports Academy—booking, availability, services, events, and contact. What would you like to know?"
3. Present the actual data from the context directly in your reply. List availability slots, service prices, event dates, and addresses when the user asks—do NOT tell them to "go to the availability page" or "check the website" to see this information. Give them the information right here.
4. For booking: after showing availability, you may add that they can book a slot below (if signed in) or go to the availability page to sign in and book.
5. Do not mention "context" or "data below" in your reply; just answer naturally.`;

function suggestLink(userMessage: string, geminiReply: string): { href: string; label: string } {
  const m = userMessage.toLowerCase();
  const r = geminiReply.toLowerCase();
  if (/\b(book|booking|reserve|availability|slot|available)\b/.test(m) || /\b(book|availability)\b/.test(r)) return { href: '/availability', label: 'Book a court' };
  if (/\b(player|players|roster)\b/.test(m)) return { href: '/players', label: 'View players' };
  return { href: '/availability', label: 'Book a court' };
}

const HTML_CONVERT_PROMPT = `Convert the following assistant message into clean HTML for a chat bubble. Rules:
- Use only these tags: <p>, <br>, <ul>, <ol>, <li>, <strong>, <b>, <em>, <a href="...">.
- For <a> use only safe relative paths like /availability or /players, or leave as plain text.
- No <script>, no style attributes, no on* attributes.
- Keep the same information and tone. Output only the HTML fragment, no markdown or explanation.`;

async function toHtmlReply(apiKey: string, text: string): Promise<{ reply: string; format: 'html' | 'text' }> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`${HTML_CONVERT_PROMPT}\n\nMessage to convert:\n${text}`);
    const html = result.response.text()?.trim() || '';
    if (html && !/<script/i.test(html)) return { reply: html, format: 'html' };
  } catch (e) {
    console.warn('HTML conversion failed:', e);
  }
  return { reply: text, format: 'text' };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body?.message ?? '').trim();
    if (!message) {
      return NextResponse.json({ reply: 'Send a question and I’ll help—e.g. “Is there availability?” or “How do I book?”', link: { href: '/availability', label: 'Book a court' } });
    }

    const payload = await getPayload({ config });
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const context = await buildAcademyContext(payload);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const prompt = `Use this context to answer the user. Only use the facts below; do not make up data.\n\n${context}\n\n---\nUser question: ${message}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text: string;
        try {
          text = response.text();
        } catch {
          text = '';
        }
        const reply = (text && text.trim()) || 'I couldn’t generate a reply. Try asking about availability, booking, or pricing.';
        const link = suggestLink(message, reply);
        const isAvailabilityQuery = /\b(availability|available|free|slot|slots|open|book|booking)\b/.test(message.toLowerCase());
        const availability = isAvailabilityQuery ? await getAvailabilityForDate(payload, tomorrowYYYYMMDD()) : undefined;
        return NextResponse.json({ reply, link, availability });
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Fall through to keyword fallback
      }
    }

    // Fallback: keyword-based replies (no Gemini or on Gemini error)
    const messageLower = message.toLowerCase();

    if (/\b(book|booking|reserve|reservation)\b/.test(messageLower)) {
      return NextResponse.json({
        reply: 'You can book a court on our availability page: pick a location (Baluwatar or Budhanilkantha), choose a date and time slot, then sign in to confirm.',
        link: { href: '/availability', label: 'Go to booking' },
      });
    }

    if (/\b(availability|available|free|slot|slots|open)\b/.test(messageLower)) {
      const { docs: locations } = await payload.find({ collection: 'locations', limit: 10, depth: 0 });
      if (locations.length === 0) {
        return NextResponse.json({ reply: 'No locations set up yet. Check back soon!', link: { href: '/availability', label: 'Availability' } });
      }
      const loc = locations[0];
      const date = tomorrowYYYYMMDD();
      const { docs: bookings } = await payload.find({
        collection: 'bookings',
        where: {
          and: [
            { location: { equals: loc.id } },
            { date: { equals: date } },
            { status: { equals: 'confirmed' } },
          ],
        },
        limit: 500,
      });
      const counts: Record<string, number> = {};
      for (const b of bookings) {
        const key = `${b.courtType}::${b.timeSlot}`;
        counts[key] = (counts[key] || 0) + 1;
      }
      const courts = (loc.courts as Array<{ courtType: string; availableSlots: number }>) || [];
      const parts: string[] = [];
      for (const court of courts) {
        const max = court.availableSlots ?? 0;
        for (const slot of TIME_SLOTS) {
          const key = `${court.courtType}::${slot}`;
          const left = Math.max(0, max - (counts[key] || 0));
          if (left > 0) parts.push(`${court.courtType} ${slot} (${left} left)`);
        }
      }
      const availabilityText = parts.length > 0 ? parts.slice(0, 4).join('; ') + (parts.length > 4 ? '…' : '') : 'No slots available for that date.';
      return NextResponse.json({
        reply: `Tomorrow (${date}) at ${loc.name}: ${availabilityText}\n\nFor other dates and to book, use the availability page.`,
        link: { href: '/availability', label: 'Check availability & book' },
      });
    }

    if (/\b(price|pricing|cost|service|services|fee|npr)\b/.test(messageLower)) {
      const { docs: services } = await payload.find({ collection: 'services', limit: 20, depth: 0 });
      const lines = services.length > 0
        ? services.map((s) => `• ${s.name}: NPR ${(s as { price?: number }).price?.toLocaleString()}/${(s as { pricingUnit?: string }).pricingUnit} (${(s as { timing?: string }).timing})`).join('\n')
        : 'Adults: NPR 12,000/month (morning). Kids: NPR 1,000/hour (evening).';
      return NextResponse.json({ reply: `Our services:\n${lines}`, link: { href: '/', label: 'View home' } });
    }

    if (/\b(event|events|upcoming|tournament)\b/.test(messageLower)) {
      const { docs: events } = await payload.find({
        collection: 'events',
        limit: 5,
        depth: 1,
        where: { startDate: { greater_than_equal: todayYYYYMMDD() } },
        sort: 'startDate',
      });
      const lines = events.length > 0
        ? events.map((e) => `• ${e.title} — ${(e as { startDate?: string }).startDate}`).join('\n')
        : 'No upcoming events right now. Check the home page for updates.';
      return NextResponse.json({ reply: `Upcoming events:\n${lines}`, link: { href: '/', label: 'Home' } });
    }

    if (/\b(player|players|roster)\b/.test(messageLower)) {
      return NextResponse.json({
        reply: 'Our player directory is on the Players page—you can filter by age and see profiles and achievements.',
        link: { href: '/players', label: 'View players' },
      });
    }

    if (/\b(contact|location|where|address|baluwatar|budhanilkantha)\b/.test(messageLower)) {
      const { docs: locs } = await payload.find({ collection: 'locations', limit: 5, depth: 0 });
      const locLines = locs.length > 0
        ? locs.map((l) => `• ${l.name}: ${l.address}`).join('\n')
        : 'Baluwatar and Budhanilkantha. See footer for map and Instagram/Facebook.';
      return NextResponse.json({
        reply: `Locations:\n${locLines}\n\nInstagram & Facebook links and map are in the footer.`,
        link: { href: '/', label: 'Home' },
      });
    }

    if (/^(hi|hello|hey|hiya)\b/.test(messageLower)) {
      return NextResponse.json({
        reply: 'Hi! Ask me about availability, booking, pricing, events, players, or contact.',
        link: { href: '/availability', label: 'Book a court' },
      });
    }

    const defaultMsg = 'I can help with availability, booking, services, events, players, and contact. Try: "Is there availability tomorrow?" or "How do I book?"';
    return await jsonReply(defaultMsg, { href: '/availability', label: 'Book a court' }, apiKey);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { reply: 'Something went wrong. Please try again or use the links below.', link: { href: '/availability', label: 'Book a court' } },
      { status: 500 }
    );
  }
}
