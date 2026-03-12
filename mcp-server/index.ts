#!/usr/bin/env node
/**
 * Flash Sports Academy — MCP Server
 * Exposes tools to answer user questions: availability, locations, services, events, players, and booking info.
 * Requires the Next.js app to be running (e.g. yarn dev) so API routes are available.
 */

import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types';

const APP_URL = process.env.MCP_APP_URL || 'http://localhost:3000';
const API = `${APP_URL}/api/mcp`;

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

const server = new Server(
  {
    name: 'flash-sports-academy',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_info',
      description: 'Get general info about Flash Sports Academy: name, tagline, pricing summary, upcoming events count, contact links (Instagram, Facebook), and booking URL. Use this first for overview questions.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_locations',
      description: 'List all locations (courts) with name, address, and court types/slots. Use for "where", "locations", "courts", "Baluwatar", "Budhanilkantha".',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'check_availability',
      description: 'Check court slot availability for a given location and date. Returns which time slots are available per court type (clay/mini) and how many spots remain. Use for "availability", "free slots", "can I book", "is X available".',
      inputSchema: {
        type: 'object',
        properties: {
          locationId: { type: 'string', description: 'Location ID (number as string). Use get_locations first to get IDs.' },
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        },
        required: ['locationId', 'date'],
      },
    },
    {
      name: 'get_services',
      description: 'List all services with pricing: name, category (adults/kids), price, unit (month/hour), timing. Use for "pricing", "cost", "services", "kids", "adults", "NPR".',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_events',
      description: 'List upcoming events (title, dates, timing, location). Use for "events", "upcoming", "tournaments".',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max events to return (default 20)' },
          upcomingOnly: { type: 'boolean', description: 'If true, only future events (default true)' },
        },
      },
    },
    {
      name: 'get_players',
      description: 'List players with name, age, birthday, profile image. Optionally filter by age range. Use for "players", "roster", "age filter".',
      inputSchema: {
        type: 'object',
        properties: {
          minAge: { type: 'number', description: 'Minimum age' },
          maxAge: { type: 'number', description: 'Maximum age' },
          limit: { type: 'number', description: 'Max players to return (default 50)' },
        },
      },
    },
    {
      name: 'get_booking_instructions',
      description: 'Get instructions and URL for how to book a court slot. Optionally pass location and date to give targeted instructions. Booking must be completed on the website (user must be logged in).',
      inputSchema: {
        type: 'object',
        properties: {
          locationId: { type: 'string' },
          date: { type: 'string', description: 'YYYY-MM-DD' },
          timeSlot: { type: 'string', description: 'e.g. "6:00 AM - 7:00 AM"' },
          courtType: { type: 'string', enum: ['clay', 'mini'] },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args || {}) as Record<string, unknown>;

  try {
    switch (name) {
      case 'get_info': {
        const info = await fetchApi<{
          name: string;
          tagline: string;
          locations: number;
          pricingSummary: Array<{ name: string; category: string; price: number; unit: string; timing: string }>;
          upcomingEventsCount: number;
          contact: { instagram: string; facebook: string };
          bookingUrl: string;
          websiteBase: string;
        }>('/info');
        const pricing = info.pricingSummary.map((p) => `${p.name} (${p.category}): NPR ${p.price.toLocaleString()}/${p.unit} — ${p.timing}`).join('\n');
        return {
          content: [
            {
              type: 'text',
              text: `${info.name} — ${info.tagline}\n\nLocations: ${info.locations}\n\nPricing:\n${pricing}\n\nUpcoming events: ${info.upcomingEventsCount}\n\nBook a court: ${info.websiteBase}${info.bookingUrl}\n\nContact: Instagram ${info.contact.instagram} | Facebook ${info.contact.facebook}`,
            },
          ],
        };
      }

      case 'get_locations': {
        const { locations } = await fetchApi<{ locations: Array<{ id: number; name: string; slug: string; address: string; courts: Array<{ courtType: string; timing: string; availableSlots: number; level: string }> }> }>('/locations');
        const lines = locations.map((loc) => {
          const courts = loc.courts.map((c) => `${c.courtType} (${c.availableSlots} slots, ${c.timing})`).join(', ');
          return `• ${loc.name} (ID: ${loc.id}) — ${loc.address}\n  Courts: ${courts}`;
        });
        return { content: [{ type: 'text', text: lines.length ? lines.join('\n\n') : 'No locations found.' }] };
      }

      case 'check_availability': {
        const locationId = String(a.locationId ?? '');
        const date = String(a.date ?? '');
        if (!locationId || !date) {
          return { content: [{ type: 'text', text: 'Missing locationId or date (YYYY-MM-DD). Use get_locations to get location IDs.' }] };
        }
        const data = await fetchApi<{
          locationName: string;
          date: string;
          slots: Array<{ courtType: string; timeSlot: string; available: number; maxSlots: number }>;
        }>(`/availability?locationId=${encodeURIComponent(locationId)}&date=${encodeURIComponent(date)}`);
        const available = data.slots.filter((s) => s.available > 0);
        const bySlot = available.map((s) => `  ${s.timeSlot} — ${s.courtType}: ${s.available}/${s.maxSlots} available`).join('\n');
        const summary = bySlot || 'No slots available for this date.';
        return {
          content: [
            {
              type: 'text',
              text: `Availability for ${data.locationName} on ${data.date}:\n\n${summary}\n\nTo book, visit ${APP_URL}/availability and log in.`,
            },
          ],
        };
      }

      case 'get_services': {
        const { services } = await fetchApi<{ services: Array<{ name: string; category: string; price: number; pricingUnit: string; timing: string }> }>('/services');
        const lines = services.map((s) => `• ${s.name} (${s.category}) — NPR ${s.price?.toLocaleString()}/${s.pricingUnit} — ${s.timing}`);
        return { content: [{ type: 'text', text: lines.length ? lines.join('\n') : 'No services found.' }] };
      }

      case 'get_events': {
        const limit = Number(a.limit) || 20;
        const upcoming = a.upcomingOnly !== false;
        const { events } = await fetchApi<{ events: Array<{ title: string; startDate: string; endDate?: string; timing?: string; location?: string }> }>(`/events?limit=${limit}&upcoming=${upcoming}`);
        const lines = events.map((e) => `• ${e.title} — ${e.startDate}${e.timing ? `, ${e.timing}` : ''}${e.location ? ` @ ${e.location}` : ''}`);
        return { content: [{ type: 'text', text: lines.length ? lines.join('\n') : 'No upcoming events.' }] };
      }

      case 'get_players': {
        const minAge = a.minAge != null ? Number(a.minAge) : undefined;
        const maxAge = a.maxAge != null ? Number(a.maxAge) : undefined;
        const limit = Number(a.limit) || 50;
        let path = `/players?limit=${limit}`;
        if (minAge != null) path += `&minAge=${minAge}`;
        if (maxAge != null) path += `&maxAge=${maxAge}`;
        const { players } = await fetchApi<{ players: Array<{ name: string; age: number; birthday: string }> }>(path);
        const lines = players.map((p) => `• ${p.name} — age ${p.age} (birthday: ${p.birthday})`);
        return { content: [{ type: 'text', text: lines.length ? lines.join('\n') : 'No players found.' }] };
      }

      case 'get_booking_instructions': {
        const base = `${APP_URL}/availability`;
        const loc = a.locationId ? ` Location ID ${a.locationId}.` : '';
        const d = a.date ? ` Date: ${a.date}.` : '';
        const slot = a.timeSlot ? ` Time: ${a.timeSlot}.` : '';
        const court = a.courtType ? ` Court: ${a.courtType}.` : '';
        return {
          content: [
            {
              type: 'text',
              text: `To book a court at Flash Sports Academy:\n1. Go to ${base}\n2. Sign in (required to book).\n3. Select location and date.${loc}${d}\n4. Choose an available slot and click "Book Now".${slot}${court}\n\nYou must be logged in to complete a booking.`,
            },
          ],
        };
      }

      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `Error: ${message}. Make sure the Next.js app is running (yarn dev) and MCP_APP_URL is correct (default http://localhost:3000).` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
