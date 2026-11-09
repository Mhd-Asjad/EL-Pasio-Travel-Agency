'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from './auth';
import {
  getCategories,
  getDestinations,
  getPackages,
  saveCategory,
  deleteCategory,
  saveDestinations,
  savePackages,
  togglePackageFeatured,
  type AdminCategory,
  type AdminDestination,
  type AdminPackage,
} from './db';

type ActionResult = { success: boolean; error?: string };

// ─── Image upload helper ───────────────────────────────────────────────────────

async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'admin');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/images/admin/${filename}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Category Actions ──────────────────────────────────────────────────────────

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) {
    return;
  }
  await saveCategory(name);
  revalidatePath('/');
  revalidatePath('/admin/categories');
  revalidatePath('/admin/destinations');
  redirect('/admin/categories');
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteCategory(id);
    revalidatePath('/');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/destinations');
  } catch (err) {
    return { success: false, error: String(err) };
  }
  return { success: true };
}

// ─── Destination Actions ───────────────────────────────────────────────────────

export async function createDestination(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = String(formData.get('title') ?? '').trim();
    const region = String(formData.get('region') ?? '').trim();
    const alt = String(formData.get('alt') ?? '').trim();
    const categoryId = String(formData.get('categoryId') ?? '').trim() || null;

    if (!title || !region || !alt) {
      return { success: false, error: 'Title, region and alt text are required.' };
    }

    const imageFile = formData.get('image');
    let src = String(formData.get('src') ?? '').trim();

    if (imageFile instanceof File && imageFile.size > 0) {
      src = await saveImage(imageFile);
    }

    if (!src) {
      return { success: false, error: 'An image is required.' };
    }

    const destinations = await getDestinations();
    const id = slugify(title) || `dest-${Date.now()}`;

    const existing = destinations.find((d) => d.id === id);
    if (existing) {
      return { success: false, error: `A destination with id "${id}" already exists.` };
    }

    const newDest: AdminDestination = {
      id,
      title,
      region,
      alt,
      src,
      categoryId,
      createdAt: new Date().toISOString(),
    };

    await saveDestinations([...destinations, newDest]);
    revalidatePath('/');
    revalidatePath('/admin/destinations');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect('/admin/destinations');
}

export async function updateDestination(id: string, _prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = String(formData.get('title') ?? '').trim();
    const region = String(formData.get('region') ?? '').trim();
    const alt = String(formData.get('alt') ?? '').trim();
    const categoryId = String(formData.get('categoryId') ?? '').trim() || null;

    if (!title || !region || !alt) {
      return { success: false, error: 'Title, region and alt text are required.' };
    }

    const destinations = await getDestinations();
    const idx = destinations.findIndex((d) => d.id === id);
    if (idx === -1) {
      return { success: false, error: 'Destination not found.' };
    }

    let src = destinations[idx].src;
    const imageFile = formData.get('image');
    if (imageFile instanceof File && imageFile.size > 0) {
      src = await saveImage(imageFile);
    }

    destinations[idx] = { ...destinations[idx], title, region, alt, src, categoryId };
    await saveDestinations(destinations);
    revalidatePath('/');
    revalidatePath('/admin/destinations');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect('/admin/destinations');
}

export async function deleteDestination(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [destinations, packages] = await Promise.all([getDestinations(), getPackages()]);
    const filtered = destinations.filter((d) => d.id !== id);
    const filteredPkgs = packages.filter((p) => p.destinationId !== id);
    await saveDestinations(filtered);
    await savePackages(filteredPkgs);
    revalidatePath('/');
    revalidatePath('/admin/destinations');
    revalidatePath('/admin/packages');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  return { success: true };
}

// ─── Package Actions ───────────────────────────────────────────────────────────

export async function createPackage(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const destinationId = String(formData.get('destinationId') ?? '').trim();

    if (!destinationId) {
      return { success: false, error: 'Please select a destination.' };
    }

    const [packages, destinations] = await Promise.all([getPackages(), getDestinations()]);
    const dest = destinations.find((d) => d.id === destinationId);
    const destRegion = dest?.region ?? '';
    const destTitle = dest?.title ?? 'Package';
    const label = String(formData.get('label') ?? '').trim() || destTitle;

    // Parse highlights
    const highlights: string[] = [];
    const rawHighlights = formData.getAll('highlights');
    if (rawHighlights.length > 0) {
      for (const h of rawHighlights) {
        const str = String(h).trim();
        if (str) highlights.push(str);
      }
    } else {
      // Fallback for indexed highlights
      for (let i = 0; i < 15; i++) {
        const h = String(formData.get(`highlight_${i}`) ?? '').trim();
        if (h) highlights.push(h);
      }
    }

    // Process multiple uploaded brochure/package images
    const rawFiles = formData.getAll('images');
    const images: string[] = [];

    for (const item of rawFiles) {
      if (item instanceof File && item.size > 0) {
        const savedPath = await saveImage(item);
        images.push(savedPath);
      }
    }

    // Check single image fallback if 'image' was used
    const singleFile = formData.get('image');
    if (singleFile instanceof File && singleFile.size > 0) {
      const savedPath = await saveImage(singleFile);
      images.push(savedPath);
    }

    if (images.length === 0) {
      return { success: false, error: 'Please upload at least one brochure or package image.' };
    }

    const id = `${slugify(label)}-pkg-${Date.now()}`;
    const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';

    const newPkg: AdminPackage = {
      id,
      destinationId,
      label,
      highlights,
      images,
      src: images[0],
      featured,
      region: destRegion,
      lead: label,
      accent: destTitle,
      blurb: highlights.length > 0 ? highlights.join(' • ') : `${label} holiday package.`,
      alt: `${label} brochure`,
      bg: 'var(--navy-950)',
      tone: 'dark',
      createdAt: new Date().toISOString(),
    };

    await savePackages([...packages, newPkg]);
    revalidatePath('/');
    revalidatePath('/admin/packages');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect('/admin/packages');
}

export async function updatePackage(id: string, _prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const destinationId = String(formData.get('destinationId') ?? '').trim();

    if (!destinationId) {
      return { success: false, error: 'Please select a destination.' };
    }

    const [packages, destinations] = await Promise.all([getPackages(), getDestinations()]);
    const idx = packages.findIndex((p) => p.id === id);
    if (idx === -1) {
      return { success: false, error: 'Package not found.' };
    }

    const dest = destinations.find((d) => d.id === destinationId);
    const destRegion = dest?.region ?? packages[idx].region ?? '';
    const destTitle = dest?.title ?? packages[idx].accent ?? 'Package';
    const label = String(formData.get('label') ?? '').trim() || packages[idx].label || destTitle;

    const highlights: string[] = [];
    const rawHighlights = formData.getAll('highlights');
    if (rawHighlights.length > 0) {
      for (const h of rawHighlights) {
        const str = String(h).trim();
        if (str) highlights.push(str);
      }
    } else {
      for (let i = 0; i < 15; i++) {
        const h = String(formData.get(`highlight_${i}`) ?? '').trim();
        if (h) highlights.push(h);
      }
    }

    // Retained existing images
    let retainedImages: string[] = [];
    const existingRaw = formData.get('existingImages');
    if (typeof existingRaw === 'string' && existingRaw) {
      try {
        retainedImages = JSON.parse(existingRaw);
      } catch {
        retainedImages = [];
      }
    } else if (packages[idx].images) {
      retainedImages = [...packages[idx].images];
    } else if (packages[idx].src) {
      retainedImages = [packages[idx].src];
    }

    // New uploaded images
    const rawFiles = formData.getAll('images');
    const newImages: string[] = [];
    for (const item of rawFiles) {
      if (item instanceof File && item.size > 0) {
        const savedPath = await saveImage(item);
        newImages.push(savedPath);
      }
    }

    const singleFile = formData.get('image');
    if (singleFile instanceof File && singleFile.size > 0) {
      const savedPath = await saveImage(singleFile);
      newImages.push(savedPath);
    }

    const allImages = [...retainedImages, ...newImages];
    if (allImages.length === 0) {
      return { success: false, error: 'Please include at least one brochure or package image.' };
    }

    const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';

    packages[idx] = {
      ...packages[idx],
      destinationId,
      label,
      highlights,
      images: allImages,
      src: allImages[0],
      featured,
      region: destRegion,
      lead: label,
      accent: destTitle,
      blurb: highlights.length > 0 ? highlights.join(' • ') : packages[idx].blurb || `${label} package`,
      alt: `${label} package brochure`,
    };

    await savePackages(packages);
    revalidatePath('/');
    revalidatePath('/admin/packages');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect('/admin/packages');
}

export async function deletePackage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const packages = await getPackages();
    const filtered = packages.filter((p) => p.id !== id);
    await savePackages(filtered);
    revalidatePath('/');
    revalidatePath('/admin/packages');
  } catch (err) {
    return { success: false, error: String(err) };
  }

  return { success: true };
}

export async function togglePackageFeaturedAction(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await togglePackageFeatured(id, featured);
    revalidatePath('/');
    revalidatePath('/admin/packages');
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
