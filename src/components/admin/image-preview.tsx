'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  name: string;
  required?: boolean;
};

export function ImagePreview({ name, required }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        onChange={handleChange}
        className="block w-full text-sm text-cream/60
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-gold-400/10 file:text-gold-400
          hover:file:bg-gold-400/20 file:cursor-pointer cursor-pointer
          focus:outline-none"
      />
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-auto rounded-lg object-cover border border-cream/10"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            title="Remove image"
            className="absolute -top-2 -right-2 size-5 rounded-full bg-red-900/90 text-red-200 hover:bg-red-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
