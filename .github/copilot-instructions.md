# Flash Sports Academy — Project Instructions

> Nepal's premier tennis training academy with locations in Baluwatar and Budhanilkantha.

---

## Tech Stack

| Layer           | Technology                                          |
| --------------- | --------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Server Components)          |
| CMS / Backend   | Payload CMS 3.77 (Local API, PostgreSQL)            |
| Database        | PostgreSQL (via `@payloadcms/db-postgres`)           |
| Rich Text       | Lexical (`@payloadcms/richtext-lexical`)             |
| Styling         | Tailwind CSS v4 (CSS-based theme, no config file)   |
| Auth            | Payload built-in auth, cookie-based sessions        |
| Email           | Nodemailer                                           |
| Icons           | `react-icons` (`IoIosFlash` for logo)               |
| Image Processing| Sharp                                                |
| Language        | TypeScript (strict mode)                             |
| Package Manager | Yarn                                                 |

---

## Design System

### Color Palette

Only three colors are used across the entire application:

| Token            | Value     | Usage                                    |
| ---------------- | --------- | ---------------------------------------- |
| `primary`        | `#aed639` | Accents, active states, CTAs, highlights |
| `primary-dark`   | `#96b830` | Hover states on primary backgrounds      |
| `black`          | `#000000` | Text, borders (`black/10`, `black/50`)   |
| `white`          | `#ffffff` | Backgrounds, button text on dark buttons |

**Rules:**
- Never use Tailwind built-in colors like `emerald-*`, `zinc-*`, `blue-*`, `gray-*`, etc.
- Use opacity modifiers for subtle tones: `text-black/60`, `border-black/10`, `bg-black/5`.
- Buttons: `bg-black text-white` with `hover:bg-primary hover:text-black`.
- Focus rings: `focus:border-primary focus:ring-2 focus:ring-primary/20`.
- Success messages: `bg-primary/20 text-black`. Error messages: `bg-red-50 text-red-700`.

### Typography

| Font             | CSS Variable      | Tailwind Class  | Usage                          |
| ---------------- | ------------------ | --------------- | ------------------------------ |
| Barlow Condensed | `--font-heading`   | `font-heading`  | Headings, navbar, tabs, labels |
| Rubik 400        | `--font-body`      | `font-body`     | Body text, paragraphs, inputs  |

Fonts are imported via Google Fonts in `globals.css`. The `body` element defaults to `font-body`; all `h1`–`h6` elements default to `font-heading`.

### Animations

Defined in `globals.css`:
- `animate-fade-in-up` — fade + slide up (0.6s)
- `animate-fade-in` — simple fade (0.5s)
- `animate-scale-in` — scale from 0.96 (0.5s)
- `animate-on-scroll` + `.is-visible` — Intersection Observer scroll reveal

---

## Directory Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── globals.css      # Theme tokens, fonts, animations
│   │   ├── layout.tsx       # Navbar + Footer wrapper
│   │   ├── page.tsx         # Home page
│   │   ├── availability/    # Slot booking page
│   │   │   ├── page.tsx
│   │   │   └── SlotBooking.tsx
│   │   └── players/
│   │       └── page.tsx     # Player directory with age filter
│   │
│   ├── (auth)/              # Authentication pages
│   │   ├── layout.tsx       # Centered card layout
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── LoginForm.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── RegisterForm.tsx
│   │
│   ├── (admin-portal)/      # Admin dashboard (role: admin)
│   │   ├── layout.tsx       # PortalNav sidebar + auth guard
│   │   └── admin-portal/
│   │       ├── page.tsx            # Dashboard with stats
│   │       ├── bookings/page.tsx   # Booking management
│   │       ├── players/            # CRUD: list, new, [id]/edit
│   │       ├── locations/          # CRUD: list, new, [id]/edit
│   │       ├── services/           # CRUD: list, new, [id]/edit
│   │       └── events/             # CRUD: list, new, [id]/edit
│   │
│   ├── (user-portal)/       # User dashboard (role: user)
│   │   ├── layout.tsx       # PortalNav sidebar + auth guard
│   │   └── dashboard/
│   │       └── page.tsx     # Booking form, pricing, locations
│   │
│   └── (payload)/           # Payload CMS admin panel
│       └── admin/[[...segments]]/
│
├── components/
│   ├── Navbar.tsx           # Sticky top nav with active link highlighting
│   ├── Footer.tsx           # Social links (Instagram, Facebook), copyright
│   ├── Container.tsx        # Max-width wrapper component
│   ├── PortalNav.tsx        # Sidebar nav for admin/user portals
│   ├── AnimateInView.tsx    # Intersection Observer scroll animation wrapper
│   ├── BookingForm.tsx      # Court booking form (email-based via nodemailer)
│   └── admin/
│       ├── PlayerForm.tsx   # Create/edit player with profile image
│       ├── LocationForm.tsx # Create/edit location with courts array
│       ├── ServiceForm.tsx  # Create/edit service with thumbnail
│       ├── EventForm.tsx    # Create/edit event with images
│       └── DeleteButton.tsx # Confirmation-based delete button
│
├── lib/
│   ├── auth.ts              # getCurrentUser() — reads Payload session from cookies
│   ├── access.ts            # Access control: isAdmin, isPublicRead, isAdminOrLoggedIn, isAdminFieldAccess
│   └── actions/
│       ├── auth.ts          # loginAction, registerAction, logoutAction
│       ├── booking.ts       # submitBookingAction (email via nodemailer)
│       ├── crud.ts          # CRUD server actions for all collections
│       └── slot-booking.ts  # bookSlotAction, getBookingsForDate
│
└── payload/
    ├── payload.config.ts    # Payload config: collections, DB, editor, sharp
    ├── payload-types.ts     # Auto-generated types (yarn generate:types)
    ├── fields/
    │   └── defaultLexical.ts
    └── collections/
        ├── index.ts         # Barrel export for all collections
        ├── Users/index.ts
        ├── Media/index.ts
        ├── Locations/index.ts
        ├── Players/index.ts
        ├── Services/index.ts
        ├── Events/index.ts
        └── Bookings/index.ts
```

---

## Payload CMS Collections

### Users
- **Fields:** `name` (text), `role` (select: `user` | `admin`)
- **Auth:** Built-in Payload auth (email + password)
- **Access:** Public create, admin/self read+update, admin delete

### Media
- **Fields:** `alt` (text)
- **Upload:** Static dir `media`, image MIME types only
- **Access:** Public read, admin write

### Locations
- **Fields:** `name`, `slug`, `address`, `description` (richText), `thumbnail` (upload → Media), `gallery` (array of images)
- **Nested Array — `courts`:**
  - `courtType` (select: `clay` | `mini`)
  - `timing` (text, e.g. "6:00 AM - 10:00 AM")
  - `availableSlots` (number, min 0)
  - `level` (select: `beginner` | `intermediate` | `advanced` | `all`)
- **Access:** Public read, admin write
- **Seed Data:** Baluwatar (2 clay + 1 mini), Budhanilkantha (4 clay)

### Players
- **Fields:** `name`, `slug`, `birthday` (date), `age` (number, auto-computed, read-only), `profileImage` (upload → Media), `achievements` (richText)
- **Hook:** `beforeChange` calculates `age` from `birthday` on every create/update
- **Access:** Public read, admin write

### Services
- **Fields:** `name`, `slug`, `category` (select: `adults` | `kids`), `price` (number), `pricingUnit` (select: `month` | `hour`), `timing` (select: `morning` | `evening`), `thumbnail` (upload → Media), `description` (richText)
- **Access:** Public read, admin write

### Events
- **Fields:** `title`, `slug`, `description` (richText), `startDate`, `endDate`, `timing`, `thumbnail` (upload → Media), `images` (array of uploads), `location` (relationship → Locations)
- **Access:** Public read, admin write

### Bookings
- **Fields:** `user` (relationship → Users), `userName`, `userEmail`, `location` (relationship → Locations), `courtType` (select: `clay` | `mini`), `date`, `timeSlot`, `status` (select: `confirmed` | `cancelled`)
- **Access:** Admin/owner read, logged-in create, admin update/delete

---

## Authentication & Access Control

**Session management:** Payload's built-in cookie-based auth. The `getCurrentUser()` function in `src/lib/auth.ts` reads session headers and returns an `AuthUser` object (`id`, `email`, `name`, `role`).

**Roles:** `user` and `admin`.

**Access functions** (`src/lib/access.ts`):
- `isAdmin` — allows only admin role
- `isAdminOrLoggedIn` — allows any authenticated user
- `isPublicRead` — always returns `true` (public GET)
- `isAdminFieldAccess` — admin-only field-level access

**Route protection:**
- `(admin-portal)/layout.tsx` redirects non-admin users to `/login`
- `(user-portal)/layout.tsx` redirects unauthenticated users to `/login`
- Server actions check `req.user` before mutations

---

## Server Actions

### Auth (`src/lib/actions/auth.ts`)
- `loginAction(formData)` — authenticates user, sets cookie, redirects by role
- `registerAction(formData)` — creates user, auto-logs in
- `logoutAction()` — clears session cookie, redirects to `/login`

### Booking (`src/lib/actions/booking.ts`)
- `submitBookingAction(formData)` — sends booking request email via nodemailer

### Slot Booking (`src/lib/actions/slot-booking.ts`)
- `bookSlotAction(formData)` — validates availability, creates Booking record, revalidates `/availability`
- `getBookingsForDate(locationId, date)` — returns `Record<string, number>` of booking counts per `courtType::timeSlot` key

### CRUD (`src/lib/actions/crud.ts`)
- `deleteDocument(collection, id)` — generic delete
- `createPlayer / updatePlayer` — with image upload
- `createLocation / updateLocation` — with dynamic courts array
- `createService / updateService` — with thumbnail upload
- `createEvent / updateEvent` — with thumbnail + images array

---

## Frontend Pages

### Home (`/`)
Server Component. Fetches locations, services, events, players via Payload Local API. Sections: Hero, Services overview, Locations preview, Events, Players showcase, CTA.

### Availability (`/availability`)
Server Component page + `SlotBooking` client component. Users select a location (tabs), pick a date, and see a grid of time slots per court type. Each slot shows remaining availability. Logged-in users can book directly. Booking counts refresh after each action.

**Time slots:** 6–10 AM and 3–7 PM (1-hour blocks).

### Players (`/players`)
Server Component with age range filter via search params. Fetches players with `where` queries on the `age` field. Renders player cards in a responsive grid.

### Login / Register (`/login`, `/register`)
Client component forms using `useActionState`. Centered card layout on light background.

### Admin Portal (`/admin-portal/*`)
Protected by admin role. Dashboard with stats, plus CRUD pages for Players, Locations, Services, Events, and a Bookings list.

### User Dashboard (`/dashboard`)
Protected by auth. Booking form (email-based), pricing cards, location info.

---

## Component Patterns

### Navbar (`src/components/Navbar.tsx`)
- Client component (`usePathname` for active link detection)
- Logo: `IoIosFlash` icon + "Flash Sports Academy" text
- Desktop: horizontal nav links + social icons + auth button
- Mobile: hamburger menu with slide-down panel
- Active link: `text-primary`, inactive: `text-black/60`
- All nav items use `font-heading text-sm font-semibold uppercase`

### PortalNav (`src/components/PortalNav.tsx`)
- Client component, sidebar layout (w-64)
- Admin: grouped links (Overview, Manage, Other)
- User: flat link list
- Logo matches Navbar style
- User avatar: first letter of name in `bg-primary/20` circle
- Sign out button at bottom

### Admin Forms
- Located in `src/components/admin/`
- All use server actions from `src/lib/actions/crud.ts`
- Image uploads handled via FormData
- Location form includes dynamic courts array management

---

## Environment Variables

```
DATABASE_URL=        # PostgreSQL connection string
PAYLOAD_SECRET=      # Payload CMS secret key
SMTP_HOST=           # SMTP server host
SMTP_PORT=           # SMTP port
SMTP_USER=           # SMTP username
SMTP_PASS=           # SMTP password
BOOKING_EMAIL=       # Email address for booking notifications
GEMINI_API_KEY=      # Optional: Google Gemini API key for chat bubble (get from Google AI Studio). If unset, chat uses keyword fallback.
```

---

## Scripts

```bash
yarn dev              # Start development server
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint
yarn generate:types   # Regenerate Payload types (payload-types.ts)
yarn generate:importmap  # Regenerate Payload import map
```

---

## Coding Conventions

1. **TypeScript strict** — no `any`. All collections, fields, and queries are strictly typed.
2. **Server Components by default** — only add `'use client'` when state or browser APIs are needed.
3. **Data fetching** — always use Payload Local API (`getPayload({ config })`) in Server Components. Never call REST API from the server.
4. **Path alias** — `@/` maps to `src/`.
5. **Tailwind only** — no CSS modules, no inline styles. All styling via Tailwind utility classes using the defined color palette.
6. **Font usage** — `font-heading` for headings/nav/tabs/labels, default `font-body` for everything else.
7. **Buttons** — `bg-black text-white hover:bg-primary hover:text-black` for primary actions. `border border-black/20 text-black/70 hover:bg-black/5` for secondary.
8. **Forms** — inputs use `border-black/20 focus:border-primary focus:ring-2 focus:ring-primary/20`.
9. **Access control** — every collection must define `access` using functions from `src/lib/access.ts`.
10. **Server actions** — all mutations go through `src/lib/actions/`. Use `revalidatePath` after writes.
