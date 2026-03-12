# Flash Sports Academy — MCP Server

An [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that exposes Flash Sports Academy data and actions as **tools**. Use it from Cursor, Claude Desktop, or any MCP client to answer user questions about availability, services, events, players, and booking.

## Prerequisites

- **Next.js app must be running** so the API routes are available (e.g. `yarn dev` in the project root).
- Node.js 18+.

## Setup

```bash
cd mcp-server
npm install
```

## Running the server

**Development (stdio, for Cursor/Claude):**

```bash
npx tsx index.ts
```

**With custom app URL (if the app is not on localhost:3000):**

```bash
MCP_APP_URL=https://your-app.vercel.app npx tsx index.ts
```

## Cursor configuration

Add this to your Cursor MCP settings (e.g. **Settings → MCP → Edit config**) so Cursor can run the server and use its tools:

```json
{
  "mcpServers": {
    "flash-sports-academy": {
      "command": "npx",
      "args": ["tsx", "index.ts"],
      "cwd": "/path/to/hack-ai-thon/mcp-server",
      "env": {
        "MCP_APP_URL": "http://localhost:3000"
      }
    }
  }
}
```

Use the real path to `mcp-server` for `cwd`. Leave `MCP_APP_URL` as `http://localhost:3000` when developing locally, or set it to your deployed app URL.

## Tools provided

| Tool | Description |
|------|-------------|
| **get_info** | General info: name, tagline, pricing summary, upcoming events count, contact links, booking URL. |
| **get_locations** | List all locations (courts) with name, address, court types and slot counts. |
| **check_availability** | Slot availability for a location and date (YYYY-MM-DD). Returns free slots per court type. |
| **get_services** | List services with pricing (adults/kids, NPR, unit, timing). |
| **get_events** | List upcoming events (title, dates, timing, location). |
| **get_players** | List players; optional filters: minAge, maxAge, limit. |
| **get_booking_instructions** | How to book (URL + steps). Optional: locationId, date, timeSlot, courtType for targeted instructions. |

Booking is completed on the website (user must be logged in). The MCP does not create bookings; it checks availability and returns instructions and links.

## API routes used

The server calls these Next.js API routes (must be running):

- `GET /api/mcp/info`
- `GET /api/mcp/locations`
- `GET /api/mcp/availability?locationId=&date=`
- `GET /api/mcp/services`
- `GET /api/mcp/events?limit=&upcoming=`
- `GET /api/mcp/players?minAge=&maxAge=&limit=`

All are defined under `src/app/api/mcp/` in the main Next.js app.
