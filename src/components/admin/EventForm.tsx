'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createEvent, updateEvent } from '@/lib/actions/crud';

interface LocationOption {
  id: number | string;
  name: string;
}

interface ImageInfo {
  id: number;
  url: string;
}

interface EventFormProps {
  locations: LocationOption[];
  event?: {
    id: number | string;
    title: string;
    slug: string;
    startDate: string;
    endDate: string;
    timing: string;
    location: number | string;
    thumbnail?: ImageInfo | null;
    images?: ImageInfo[];
  };
}

export function EventForm({ locations, event }: EventFormProps) {
  const isEdit = !!event;
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ImageInfo[]>(event?.images ?? []);

  const handleSubmit = async (formData: FormData) => {
    formData.set('existingImages', JSON.stringify(existingImages.map((img) => ({ image: img.id }))));
    if (isEdit) {
      await updateEvent(event.id, formData);
    } else {
      await createEvent(formData);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImagePreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
    }
  };

  const removeExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const inputClass = 'h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-black">Title</label>
        <input id="title" name="title" type="text" required defaultValue={event?.title} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-black">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={event?.slug} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-sm font-medium text-black">Start Date</label>
          <input id="startDate" name="startDate" type="date" required defaultValue={event?.startDate?.split('T')[0]} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="text-sm font-medium text-black">End Date</label>
          <input id="endDate" name="endDate" type="date" required defaultValue={event?.endDate?.split('T')[0]} className={inputClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="timing" className="text-sm font-medium text-black">Timing</label>
        <input id="timing" name="timing" type="text" placeholder="e.g. 9:00 AM - 5:00 PM" defaultValue={event?.timing} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="location" className="text-sm font-medium text-black">Location</label>
        <select id="location" name="location" required defaultValue={event?.location} className={inputClass}>
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="thumbnail" className="text-sm font-medium text-black">Thumbnail</label>
        {(thumbnailPreview || event?.thumbnail) && (
          <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-black/20">
            <Image
              src={thumbnailPreview || event!.thumbnail!.url}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="text-sm text-black/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-primary/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="images" className="text-sm font-medium text-black">Event Images</label>
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img) => (
              <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-black/20">
                <Image src={img.url} alt="Event image" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-primary/50">
                <Image src={src} alt="New image preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="text-sm text-black/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-primary/30"
        />
      </div>

      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black">
        {isEdit ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
}
