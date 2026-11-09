import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
  console.error(
    "DATABASE_URL must be the Neon Postgres connection string (starts with postgresql://).\n" +
      "You currently have the Data API REST URL.\n" +
      "In Neon Console: Connect → pooled connection string → replace DATABASE_URL in .env.local.",
  );
  process.exit(1);
}

const sql = neon(url);
const seed = JSON.parse(
  await readFile(path.join(root, "data", "destinations.json"), "utf-8"),
);

await sql`
  CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    region TEXT NOT NULL,
    alt TEXT NOT NULL,
    src TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    src TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT true,
    region TEXT,
    lead TEXT,
    accent TEXT,
    blurb TEXT,
    alt TEXT,
    bg TEXT,
    tone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

for (const dest of seed.destinations) {
  await sql`
    INSERT INTO destinations (id, title, region, alt, src, created_at)
    VALUES (${dest.id}, ${dest.title}, ${dest.region}, ${dest.alt}, ${dest.src}, ${dest.createdAt})
    ON CONFLICT (id) DO NOTHING
  `;
}

for (const pkg of seed.packages) {
  await sql`
    INSERT INTO packages (
      id, destination_id, label, highlights, images, src,
      featured, region, lead, accent, blurb, alt, bg, tone, created_at
    )
    VALUES (
      ${pkg.id},
      ${pkg.destinationId},
      ${pkg.label},
      ${pkg.highlights ?? []},
      ${pkg.images ?? []},
      ${pkg.src},
      ${pkg.featured !== false},
      ${pkg.region ?? null},
      ${pkg.lead ?? null},
      ${pkg.accent ?? null},
      ${pkg.blurb ?? null},
      ${pkg.alt ?? null},
      ${pkg.bg ?? null},
      ${pkg.tone ?? null},
      ${pkg.createdAt}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

const [destinations] = await sql`SELECT COUNT(*)::int AS count FROM destinations`;
const [packages] = await sql`SELECT COUNT(*)::int AS count FROM packages`;
console.log(
  `Neon ready. Destinations: ${destinations.count}. Packages: ${packages.count}.`,
);
