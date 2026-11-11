'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useActionState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createPackage, updatePackage } from '@/lib/admin-actions';
import type { AdminPackage, AdminDestination } from '@/lib/db';

type Props = {
  package?: AdminPackage;
  destinations: AdminDestination[];
};

export function PackageForm({ package: pkg, destinations }: Props) {
  const isEdit = !!pkg;

  const boundAction = isEdit
    ? updatePackage.bind(null, pkg.id)
    : createPackage;

  const [state, formAction, pending] = useActionState(boundAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const [selectedDestId, setSelectedDestId] = useState<string>(
    pkg?.destinationId ?? (destinations[0]?.id || '')
  );

  const initialHighlights = pkg?.highlights && pkg.highlights.length > 0 
    ? [...pkg.highlights] 
    : [''];
  const [highlights, setHighlights] = useState<string[]>(initialHighlights);

  const initialExisting = pkg?.images && pkg.images.length > 0
    ? [...pkg.images]
    : pkg?.src
    ? [pkg.src]
    : [];
  const [existingImages, setExistingImages] = useState<string[]>(initialExisting);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFileUrls, setNewFileUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  useEffect(() => {
    return () => {
      newFileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFileUrls]);

  const allImages = [...existingImages, ...newFileUrls];
  const activeImage = allImages[previewIndex] || allImages[0] || null;
  const selectedDest = destinations.find((d) => d.id === selectedDestId);

  function addHighlight() {
    setHighlights((prev) => [...prev, '']);
  }

  function removeHighlight(index: number) {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHighlight(index: number, val: string) {
    setHighlights((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const urls = fileList.map((f) => URL.createObjectURL(f));
    setNewFiles((prev) => [...prev, ...fileList]);
    setNewFileUrls((prev) => [...prev, ...urls]);
    // Allow picking the same file again and keep accumulating across picks.
    e.target.value = "";
  }

  function removeExisting(i: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
    if (previewIndex >= existingImages.length - 1) setPreviewIndex(0);
  }

  function removeNew(i: number) {
    URL.revokeObjectURL(newFileUrls[i]);
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewFileUrls((prev) => prev.filter((_, idx) => idx !== i));
    if (previewIndex >= allImages.length - 1) setPreviewIndex(0);
  }

  // Native <input type="file"> only keeps the last picker selection. Previews
  // accumulate in React state, so rebuild FormData from that list on submit.
  function submitWithAllImages(formData: FormData) {
    formData.delete("images");
    formData.delete("image");
    for (const file of newFiles) {
      formData.append("images", file);
    }
    formAction(formData);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Clean Form ── */}
      <div className="lg:col-span-7 bg-navy-900 rounded-2xl border border-cream/10 p-6 sm:p-7">
        <form action={submitWithAllImages} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-2.5 text-xs text-red-300">
              {state.error}
            </div>
          )}

          {/* Always send retained paths so create/edit keep previously saved images. */}
          <input
            type="hidden"
            name="existingImages"
            value={JSON.stringify(existingImages)}
          />

          {/* Destination */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream/60 font-semibold mb-2" htmlFor="destinationId">
              Destination
            </label>
            <select
              id="destinationId"
              name="destinationId"
              required
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full bg-navy-950 border border-cream/15 text-cream rounded-xl px-4 py-3 focus:outline-none focus:border-gold-400 text-sm cursor-pointer"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} {d.region ? `— ${d.region}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-cream/60 font-semibold">
                Highlights
              </label>
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add item</span>
              </button>
            </div>

            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    name="highlights"
                    type="text"
                    value={h}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    placeholder="Highlight detail"
                    className="flex-1 bg-navy-950 border border-cream/15 text-cream rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold-400 placeholder:text-cream/20 text-sm"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="size-8 rounded-lg text-cream/30 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove highlight"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brochure Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-cream/60 font-semibold">
                Brochure & Photos
              </label>
              <span className="text-xs text-cream/40">
                {allImages.length} file{allImages.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-cream/20 hover:border-gold-400/60 rounded-xl py-6 px-4 text-center bg-navy-950/40 hover:bg-navy-950/80 transition-colors cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                className="hidden"
              />
              <Upload className="size-5 text-cream/40 group-hover:text-gold-400 mx-auto mb-1.5 transition-colors" />
              <p className="text-xs text-cream/70 font-medium">
                Click to add brochure images or drag & drop
              </p>
            </div>

            {/* Thumbnails */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-3">
                {existingImages.map((src, i) => (
                  <div
                    key={`existing-${i}`}
                    onClick={() => setPreviewIndex(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer group ${
                      activeImage === src
                        ? 'border-gold-400 ring-1 ring-gold-400'
                        : 'border-cream/15 hover:border-cream/40'
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExisting(i);
                      }}
                      className="absolute top-1 right-1 size-5 rounded-full bg-navy-950/90 text-white hover:text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}

                {newFileUrls.map((url, i) => {
                  const actualIdx = existingImages.length + i;
                  return (
                    <div
                      key={`new-${i}`}
                      onClick={() => setPreviewIndex(actualIdx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer group ${
                        activeImage === url
                          ? 'border-gold-400 ring-1 ring-gold-400'
                          : 'border-gold-400/40'
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNew(i);
                        }}
                        className="absolute top-1 right-1 size-5 rounded-full bg-navy-950/90 text-white hover:text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        title="Remove image"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Featured on homepage */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={pkg?.featured !== false}
                className="size-4 rounded accent-gold-400 bg-navy-950 border-cream/20 cursor-pointer"
              />
              <span className="text-xs font-medium text-cream/80">
                Highlight this package on its destination page
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-gold-400 text-navy-950 font-semibold rounded-full px-6 py-2.5 hover:bg-gold-300 transition-colors text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {pending ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Package'}
            </button>
            <a
              href="/admin/packages"
              className="text-cream/40 hover:text-cream text-xs uppercase tracking-wider px-4 py-2.5 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>

      {/* ── Right Column: Clean Review ── */}
      <div className="lg:col-span-5 sticky top-6">
        <div className="bg-navy-950 rounded-2xl border border-cream/10 p-6 overflow-hidden">
          {/* Header */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Preview
            </p>
            <h3 className="mt-1 font-display text-2xl italic text-cream leading-tight">
              {selectedDest?.title || 'Destination'}
            </h3>
            {selectedDest?.region && (
              <p className="text-xs text-cream/40 mt-0.5">{selectedDest.region}</p>
            )}
          </div>

          {/* Brochure View */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-navy-900 border border-cream/10 mb-3">
            {activeImage ? (
              <Image
                src={activeImage}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="size-full flex items-center justify-center text-xs text-cream/25">
                No brochure selected
              </div>
            )}

            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-navy-950/80 text-[10px] text-cream/80 px-2 py-0.5 rounded-full border border-cream/20">
                {previewIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Brochure Pages Nav */}
          {allImages.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  className={`relative size-12 shrink-0 rounded-lg overflow-hidden border transition-all ${
                    previewIndex === i
                      ? 'border-gold-400 scale-105'
                      : 'border-cream/15 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}

          {/* Highlights */}
          {highlights.filter((h) => h.trim().length > 0).length > 0 && (
            <div className="pt-3 border-t border-cream/10">
              <ul className="space-y-1.5">
                {highlights
                  .filter((h) => h.trim().length > 0)
                  .map((h, i) => (
                    <li key={i} className="text-xs text-cream/80 flex items-start gap-2">
                      <span className="text-gold-400">/</span>
                      <span>{h}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
