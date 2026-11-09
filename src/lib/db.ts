import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type AdminDestination = {
  id: string;
  title: string;
  region: string;
  alt: string;
  src: string;
  categoryId?: string | null;
  categoryName?: string | null;
  createdAt: string;
};

export type AdminPackage = {
  id: string;
  destinationId: string;
  label: string;
  highlights: string[];
  images: string[];
  src: string;
  featured?: boolean;
  region?: string;
  lead?: string;
  accent?: string;
  blurb?: string;
  alt?: string;
  bg?: string;
  tone?: "light" | "dark";
  createdAt: string;
};

type DestinationRow = {
  id: string;
  title: string;
  region: string;
  alt: string;
  src: string;
  category_id?: string | null;
  category_name?: string | null;
  created_at: string | Date;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string | Date;
};

type PackageRow = {
  id: string;
  destination_id: string;
  label: string;
  highlights: string[] | null;
  images: string[] | null;
  src: string;
  featured: boolean | null;
  region: string | null;
  lead: string | null;
  accent: string | null;
  blurb: string | null;
  alt: string | null;
  bg: string | null;
  tone: string | null;
  created_at: string | Date;
};

let schemaReady: Promise<void> | null = null;

function databaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is missing. Add it to .env.local.");
  }
  if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be the Neon Postgres connection string (starts with postgresql://). The current value is the Data API REST URL. In Neon Console click Connect, choose the pooled connection string, and paste that into .env.local.",
    );
  }
  return url;
}

function sql() {
  return neon(databaseUrl());
}

function iso(value: string | Date) {
  return value instanceof Date ? value.toISOString() : String(value);
}

function mapDestination(row: DestinationRow): AdminDestination {
  return {
    id: row.id,
    title: row.title,
    region: row.region,
    alt: row.alt,
    src: row.src,
    categoryId: row.category_id ?? null,
    categoryName: row.category_name ?? null,
    createdAt: iso(row.created_at),
  };
}

function mapCategory(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: iso(row.created_at),
  };
}

function mapPackage(row: PackageRow): AdminPackage {
  return {
    id: row.id,
    destinationId: row.destination_id,
    label: row.label,
    highlights: row.highlights ?? [],
    images: row.images ?? [],
    src: row.src,
    featured: row.featured ?? true,
    region: row.region ?? undefined,
    lead: row.lead ?? undefined,
    accent: row.accent ?? undefined,
    blurb: row.blurb ?? undefined,
    alt: row.alt ?? undefined,
    bg: row.bg ?? undefined,
    tone: row.tone === "light" || row.tone === "dark" ? row.tone : undefined,
    createdAt: iso(row.created_at),
  };
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = sql();
      await db`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS destinations (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          region TEXT NOT NULL,
          alt TEXT NOT NULL,
          src TEXT NOT NULL,
          category_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await db`ALTER TABLE destinations ADD COLUMN IF NOT EXISTS category_id TEXT`;
      await db`
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
      await db`
        CREATE TABLE IF NOT EXISTS admins (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      const [destCount] = await db`SELECT COUNT(*)::int AS count FROM destinations`;
      if ((destCount?.count ?? 0) === 0) {
        await seedFromJson();
      }
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

async function seedFromJson() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "destinations.json"),
    "utf-8",
  );
  const data = JSON.parse(raw) as {
    destinations: AdminDestination[];
    packages: AdminPackage[];
  };
  const db = sql();

  for (const dest of data.destinations) {
    await db`
      INSERT INTO destinations (id, title, region, alt, src, created_at)
      VALUES (
        ${dest.id},
        ${dest.title},
        ${dest.region},
        ${dest.alt},
        ${dest.src},
        ${dest.createdAt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const pkg of data.packages) {
    await db`
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
}

export async function getCategories(): Promise<AdminCategory[]> {
  await ensureSchema();
  const rows = await sql()`
    SELECT id, name, slug, created_at
    FROM categories
    ORDER BY name ASC
  `;
  return (rows as CategoryRow[]).map(mapCategory);
}

export async function getCategory(id: string): Promise<AdminCategory | null> {
  await ensureSchema();
  const rows = await sql()`
    SELECT id, name, slug, created_at
    FROM categories
    WHERE id = ${id} OR slug = ${id}
    LIMIT 1
  `;
  const row = (rows as CategoryRow[])[0];
  return row ? mapCategory(row) : null;
}

export async function saveCategory(name: string): Promise<AdminCategory> {
  await ensureSchema();
  const cleanName = name.trim();
  const slug = cleanName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const id = slug || `cat-${Date.now()}`;
  const createdAt = new Date().toISOString();
  await sql()`
    INSERT INTO categories (id, name, slug, created_at)
    VALUES (${id}, ${cleanName}, ${slug}, ${createdAt})
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
  `;
  return { id, name: cleanName, slug, createdAt };
}

export async function deleteCategory(id: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`UPDATE destinations SET category_id = NULL WHERE category_id = ${id}`;
  await db`DELETE FROM categories WHERE id = ${id}`;
}

export async function getDestinations(): Promise<AdminDestination[]> {
  await ensureSchema();
  const rows = await sql()`
    SELECT d.id, d.title, d.region, d.alt, d.src, d.category_id, d.created_at, c.name AS category_name
    FROM destinations d
    LEFT JOIN categories c ON d.category_id = c.id
    ORDER BY d.created_at ASC
  `;
  return (rows as DestinationRow[]).map(mapDestination);
}

export async function getPackages(): Promise<AdminPackage[]> {
  await ensureSchema();
  const rows = await sql()`
    SELECT
      id, destination_id, label, highlights, images, src,
      featured, region, lead, accent, blurb, alt, bg, tone, created_at
    FROM packages
    ORDER BY created_at ASC
  `;
  return (rows as PackageRow[]).map(mapPackage);
}

export async function getDestination(id: string): Promise<AdminDestination | null> {
  await ensureSchema();
  const rows = await sql()`
    SELECT d.id, d.title, d.region, d.alt, d.src, d.category_id, d.created_at, c.name AS category_name
    FROM destinations d
    LEFT JOIN categories c ON d.category_id = c.id
    WHERE d.id = ${id}
    LIMIT 1
  `;
  const row = (rows as DestinationRow[])[0];
  return row ? mapDestination(row) : null;
}

export async function getPackagesByDestination(
  destinationId: string,
): Promise<AdminPackage[]> {
  await ensureSchema();
  const rows = await sql()`
    SELECT
      id, destination_id, label, highlights, images, src,
      featured, region, lead, accent, blurb, alt, bg, tone, created_at
    FROM packages
    WHERE destination_id = ${destinationId}
    ORDER BY created_at ASC
  `;
  return (rows as PackageRow[]).map(mapPackage);
}

export async function saveDestinations(dests: AdminDestination[]): Promise<void> {
  await ensureSchema();
  const db = sql();
  const ids = dests.map((d) => d.id);

  const upserts = dests.map(
    (d) => db`
      INSERT INTO destinations (id, title, region, alt, src, category_id, created_at)
      VALUES (${d.id}, ${d.title}, ${d.region}, ${d.alt}, ${d.src}, ${d.categoryId ?? null}, ${d.createdAt})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        region = EXCLUDED.region,
        alt = EXCLUDED.alt,
        src = EXCLUDED.src,
        category_id = EXCLUDED.category_id
    `,
  );

  const cleanup =
    ids.length > 0
      ? db`DELETE FROM destinations WHERE NOT (id = ANY(${ids}))`
      : db`DELETE FROM destinations`;

  await db.transaction([...upserts, cleanup]);
}

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export async function countAdmins(): Promise<number> {
  await ensureSchema();
  const [row] = await sql()`SELECT COUNT(*)::int AS count FROM admins`;
  return row?.count ?? 0;
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  await ensureSchema();
  const rows = await sql()`
    SELECT id, email, password_hash, created_at
    FROM admins
    WHERE email = ${email}
    LIMIT 1
  `;
  const row = rows[0] as
    | { id: string; email: string; password_hash: string; created_at: string | Date }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: iso(row.created_at),
  };
}

export async function createAdmin(email: string, passwordHash: string): Promise<AdminUser> {
  await ensureSchema();
  const id = `admin-${Date.now()}`;
  const createdAt = new Date().toISOString();
  await sql()`
    INSERT INTO admins (id, email, password_hash, created_at)
    VALUES (${id}, ${email}, ${passwordHash}, ${createdAt})
  `;
  return { id, email, passwordHash, createdAt };
}

export async function savePackages(pkgs: AdminPackage[]): Promise<void> {
  await ensureSchema();
  const db = sql();
  const ids = pkgs.map((p) => p.id);

  const upserts = pkgs.map(
    (p) => db`
      INSERT INTO packages (
        id, destination_id, label, highlights, images, src,
        featured, region, lead, accent, blurb, alt, bg, tone, created_at
      )
      VALUES (
        ${p.id},
        ${p.destinationId},
        ${p.label},
        ${p.highlights ?? []},
        ${p.images ?? []},
        ${p.src},
        ${p.featured !== false},
        ${p.region ?? null},
        ${p.lead ?? null},
        ${p.accent ?? null},
        ${p.blurb ?? null},
        ${p.alt ?? null},
        ${p.bg ?? null},
        ${p.tone ?? null},
        ${p.createdAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        destination_id = EXCLUDED.destination_id,
        label = EXCLUDED.label,
        highlights = EXCLUDED.highlights,
        images = EXCLUDED.images,
        src = EXCLUDED.src,
        featured = EXCLUDED.featured,
        region = EXCLUDED.region,
        lead = EXCLUDED.lead,
        accent = EXCLUDED.accent,
        blurb = EXCLUDED.blurb,
        alt = EXCLUDED.alt,
        bg = EXCLUDED.bg,
        tone = EXCLUDED.tone
    `,
  );

  const cleanup =
    ids.length > 0
      ? db`DELETE FROM packages WHERE NOT (id = ANY(${ids}))`
      : db`DELETE FROM packages`;

  await db.transaction([...upserts, cleanup]);
}

export async function togglePackageFeatured(
  id: string,
  featured: boolean,
): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    UPDATE packages
    SET featured = ${featured}
    WHERE id = ${id}
  `;

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "destinations.json"),
      "utf-8",
    );
    const data = JSON.parse(raw);
    const item = data.packages?.find((p: AdminPackage) => p.id === id);
    if (item) {
      item.featured = featured;
      await fs.writeFile(
        path.join(process.cwd(), "data", "destinations.json"),
        JSON.stringify(data, null, 2),
        "utf-8",
      );
    }
  } catch {
    // ignore
  }
}
