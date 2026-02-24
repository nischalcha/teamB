Flash Sports Academy -- Full Build Plan (Revised)

Phase 0: Switch from Bun to Yarn

The project currently uses Bun (bun.lock exists). Migrate to Yarn.





Delete bun.lock



Run yarn install to generate yarn.lock



Update README.md to reference yarn commands



All subsequent commands: yarn dev, yarn build, etc.

Phase 1: Foundation -- Environment and Database





Start Postgres via Docker: docker compose up -d



Create .env in project root with DATABASE_URL and PAYLOAD_SECRET



Run yarn dev, verify Payload Admin at http://localhost:3000/admin



Create an admin user through the Payload registration screen

Phase 2: Payload CMS Collections (Strictly Typed)

All collections under src/payload/collections/, each in its own folder with index.ts. Every collection, field, relationship, and filter must be strictly typed -- no any.

erDiagram
    Media {
        string alt
        upload file
    }
    Locations ||--o{ Events : hosts
    Locations {
        string name
        string slug
        text address
        richText description
        upload thumbnail
        array gallery
        array courts
    }
    Courts_nested["Courts (nested in Location)"] {
        select courtType
        text timing
        number availableSlots
        select level
    }
    Locations ||--|{ Courts_nested : contains
    Players {
        string name
        string slug
        number age
        date birthday
        upload profileImage
        richText achievements
    }
    Services {
        string name
        string slug
        select category
        number price
        select pricingUnit
        select timing
        richText description
    }
    Events {
        string title
        string slug
        richText description
        date startDate
        date endDate
        text timing
        array images
        relationship location
    }
    Players }o--|| Media : profileImage
    Locations }o--|| Media : thumbnail
    Events }o--|| Locations : location

a) Media -- src/payload/collections/Media/index.ts





upload collection for images (used by Players, Locations, Events)



Fields: alt (text, required)



Configure staticDir and allowed mimeTypes for images

b) Locations -- src/payload/collections/Locations/index.ts

This is the most complex collection. Courts are nested as an array field inside Location.





Top-level fields: name, slug, address, description (richText)



Image fields:





thumbnail -- single upload relationship to Media (for preview cards)



gallery -- array field, each row has an image upload to Media (for detail pages)



Courts -- array field named courts, each row contains:





courtType -- select, options: clay | mini (extensible for future types)



timing -- text (e.g. "6:00 AM - 10:00 AM")



availableSlots -- number (required, min 0)



level -- select, options: beginner | intermediate | advanced | all



Seed data: Baluwatar (2 clay courts + 1 mini court entries), Budhanilkantha (4 clay court entries)

Strict types for the courts array:

type CourtType = 'clay' | 'mini';
type CourtLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

interface Court {
    courtType: CourtType;
    timing: string;
    availableSlots: number;
    level: CourtLevel;
}

c) Players -- src/payload/collections/Players/index.ts

Key change: age is a stored number field (not just a virtual/computed field) to support efficient range queries and filtering.





Fields: name, slug, birthday (date, required), age (number, required, indexed, admin read-only), profileImage (upload to Media), achievements (richText)



**beforeChange hook: Auto-computes age from birthday on every create/update, so age is always in sync



Filtering: age field supports direct Payload where queries like { age: { greater_than_equal: 10, less_than_equal: 18 } }



Age field is set to admin: { readOnly: true } so editors cannot manually set it

// beforeChange hook logic
const calculateAge = (birthday: string): number => {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    return age;
};

d) Services -- src/payload/collections/Services/index.ts





Fields: name, slug, category (select: adults | kids), price (number, required), pricingUnit (select: month | hour), timing (select: morning | evening), description (richText)



Business logic: Adults = NPR 12,000/month (morning), Kids = NPR 1,000/hour (evening)

e) Events -- src/payload/collections/Events/index.ts





Fields: title, slug, description (richText), startDate (date), endDate (date), timing (text), images (array of uploads to Media), location (relationship to Locations)

After creating all collections:





Update collections/index.ts to export all collections



Update payload.config.ts: collections: [Users, Media, Locations, Players, Services, Events]



Add "generate:types": "payload generate:types" to package.json scripts



Run yarn dev (auto-migrates DB), then yarn generate:types to produce payload-types.ts

Phase 3: Frontend Pages

All pages under src/app/(frontend)/. Data fetching via Payload Local API (getPayload) in Server Components.

flowchart TD
    subgraph layout [Root Layout]
        Nav[Navbar]
        Footer[Footer]
    end
    Nav --> Home["/"]
    Nav --> Avail["/availability"]
    Nav --> PlayerDir["/players"]

    Home --> Hero[Hero Section]
    Home --> SvcOverview[Services Cards]
    Home --> LocPreview["Locations with Thumbnails"]
    Home --> CTA["Book Free Lesson CTA"]

    Avail --> LocSelector["Location Selector"]
    LocSelector --> CourtTable["Dynamic Court Table"]
    CourtTable --> Cols["Type | Timing | Slots | Level"]

    PlayerDir --> AgeFilter["Age Range Filter"]
    AgeFilter --> PlayerGrid["Player Cards Grid"]

Shared Components -- src/components/





Navbar -- Logo, nav links (Home, Availability, Players), social icons



Footer -- Social links (Instagram, Facebook), copyright



Container -- Max-width wrapper

a) Home Page -- src/app/(frontend)/page.tsx





Hero Section -- Bold headline, "Book Your Free Lesson" CTA



Services Overview -- Fetch Services, display pricing cards



Locations Preview -- Cards with thumbnail image, name, court count summary



CTA Section -- Contact / booking call-to-action

b) Availability Page -- src/app/(frontend)/availability/page.tsx





Fetch all Locations (with nested courts array populated)



Location selector (tabs or dropdown) to pick a location



Dynamic court table renders from the selected Location's courts array:





Columns: Court Type | Timing | Available Slots | Level



Rows: one per court entry in the nested array



Displays both clay and mini courts



Strictly typed: timing, slots, and level values match the collection schema



Location selector requires a small client component; table can be server-rendered per selection via search params or client-side filtering



Responsive: horizontal scroll wrapper on mobile

c) Player Directory -- src/app/(frontend)/players/page.tsx





Fetch Players from Payload (depth: 1 to populate profileImage)



Age range filter -- uses Payload where query on the stored age field for efficient filtering (e.g. ?minAge=10&maxAge=18 as search params)



Display player cards in a responsive grid: name, age, profile image, achievements



Filter controls: min/max age inputs (client component), triggers re-fetch via search params

Phase 4: Polish and Demo Prep





Responsive design pass on all pages (mobile-first Tailwind)



Loading states and error boundaries



Seed CMS data via Payload Admin (2 locations with courts, 3-5 players, 2 services, 1-2 events)



Final README update



Verify demo flow: Home -> Availability (switch locations, see court tables) -> Players (filter by age) -> Admin panel

