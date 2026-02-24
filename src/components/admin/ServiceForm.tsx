'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createService, updateService } from '@/lib/actions/crud';

interface ServiceFormProps {
  service?: {
    id: number | string;
    name: string;
    slug: string;
    category: string;
    price: number;
    pricingUnit: string;
    timing: string;
    thumbnail?: { id: number; url: string } | null;
  };
}

export function ServiceForm({ service }: ServiceFormProps) {
  const isEdit = !!service;
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateService(service.id, formData);
    } else {
      await createService(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass = 'h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
        <input id="name" name="name" type="text" required defaultValue={service?.name} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-black">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={service?.slug} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-black">Category</label>
          <select id="category" name="category" required defaultValue={service?.category} className={inputClass}>
            <option value="adults">Adults</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="timing" className="text-sm font-medium text-black">Timing</label>
          <select id="timing" name="timing" required defaultValue={service?.timing} className={inputClass}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-black">Price (NPR)</label>
          <input id="price" name="price" type="number" required min={0} defaultValue={service?.price} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pricingUnit" className="text-sm font-medium text-black">Pricing Unit</label>
          <select id="pricingUnit" name="pricingUnit" required defaultValue={service?.pricingUnit} className={inputClass}>
            <option value="month">Per Month</option>
            <option value="hour">Per Hour</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="thumbnail" className="text-sm font-medium text-black">Thumbnail</label>
        {(preview || service?.thumbnail) && (
          <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-black/20">
            <Image
              src={preview || service!.thumbnail!.url}
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
          onChange={handleFileChange}
          className="text-sm text-black/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-primary/30"
        />
      </div>

      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black">
        {isEdit ? 'Update Service' : 'Create Service'}
      </button>
    </form>
  );
}
