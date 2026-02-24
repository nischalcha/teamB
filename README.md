# Flash Sports Academy

A production-ready website for **Flash Sports Academy**, Nepal's premier tennis training facility. Built during the Ujyalo Ventures Hack-AI-Thon using AI-assisted development with Next.js and Payload CMS.

## About Flash Sports Academy

Flash Sports Academy operates across two locations in Kathmandu:

- **Baluwatar** — 2 clay courts, 1 mini court
- **Budhanilkantha** — 4 clay courts

### Services & Pricing

| Service | Price | Schedule |
|---------|-------|----------|
| Adults (Group Sessions) | NPR 12,000 / month | Morning |
| Kids (Sessions) | NPR 1,000 / hour | Evening |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| CMS | [Payload CMS v3](https://payloadcms.com/) |
| Database | PostgreSQL 16 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Package Manager | Yarn |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) (v1.22+)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd hack-ai-thon
yarn install
```

### 2. Start the database

```bash
docker compose up -d
```

This spins up a PostgreSQL 16 instance on port `5433` with database `hackathon`.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://local:secret@localhost:5433/hackathon
PAYLOAD_SECRET=your-secret-key-here
```

### 4. Run the development server

```bash
yarn dev
```

- **Frontend** — [http://localhost:3000](http://localhost:3000)
- **Payload Admin** — [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx              # Root layout with Navbar & Footer
│   │   ├── page.tsx                # Home — hero, services, locations, CTA
│   │   ├── globals.css
│   │   ├── availability/
│   │   │   ├── page.tsx            # Court availability (server component)
│   │   │   └── LocationTabs.tsx    # Location tab switcher (client component)
│   │   └── players/
│   │       ├── page.tsx            # Player directory with age filtering
│   │       └── AgeFilter.tsx       # Age range filter (client component)
│   └── (payload)/                  # Payload CMS admin routes
├── components/
│   ├── Container.tsx               # Max-width wrapper
│   ├── Footer.tsx                  # Site footer with social links
│   └── Navbar.tsx                  # Responsive navigation bar
└── payload/
    ├── payload.config.ts           # Main Payload configuration
    ├── collections/
    │   ├── Users/                  # Admin authentication
    │   ├── Media/                  # Image uploads
    │   ├── Locations/              # Facilities with nested courts array
    │   ├── Players/                # Athletes with auto-calculated age
    │   ├── Services/               # Lesson types and pricing
    │   └── Events/                 # Academy events
    └── fields/
        └── defaultLexical.ts       # Rich text editor config
```

## CMS Collections

| Collection | Purpose |
|-----------|---------|
| **Users** | Admin authentication |
| **Media** | Image uploads (used by Locations, Players, Events) |
| **Locations** | Facilities with thumbnail, gallery, and nested courts array (type, timing, slots, level) |
| **Players** | Athlete profiles with stored `age` field (auto-computed from birthday via `beforeChange` hook, indexed for range queries) |
| **Services** | Lesson types with pricing (Adults: NPR 12,000/mo, Kids: NPR 1,000/hr) |
| **Events** | Tournaments, camps, and academy events with dates, images, and location relationship |

## Frontend Pages

- **Home** (`/`) — Hero section, services overview, locations preview with thumbnails, "Book Your Free Lesson" CTA
- **Availability** (`/availability`) — Location tab selector with dynamic per-location court table (Court Type, Timing, Available Slots, Level)
- **Player Directory** (`/players`) — Player profile cards with age-range filter (min/max), server-side filtered via Payload `where` queries on the indexed `age` field

## Social Links

- [Instagram](https://www.instagram.com/flash_sports10/)
- [Facebook](https://www.facebook.com/flashsportsnepal/)

## Development Guidelines

- **Strict TypeScript** — No `any`. All Payload types referenced from `payload-types.ts`.
- **Server Components first** — Use `'use client'` only when interactivity is required.
- **Payload Local API** — Always use `getPayload()` for server-side data fetching.
- **Tailwind CSS** — Utility classes only; stick to the standard theme scale.

## License

Private — Built for the Ujyalo Ventures Hack-AI-Thon.
