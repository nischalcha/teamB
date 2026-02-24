'use client';

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
  };
}

export function ServiceForm({ service }: ServiceFormProps) {
  const isEdit = !!service;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateService(service.id, formData);
    } else {
      await createService(formData);
    }
  };

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
        <input id="name" name="name" type="text" required defaultValue={service?.name}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={service?.slug}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
          <select id="category" name="category" required defaultValue={service?.category}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="adults">Adults</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="timing" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timing</label>
          <select id="timing" name="timing" required defaultValue={service?.timing}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (NPR)</label>
          <input id="price" name="price" type="number" required min={0} defaultValue={service?.price}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pricingUnit" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pricing Unit</label>
          <select id="pricingUnit" name="pricingUnit" required defaultValue={service?.pricingUnit}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="month">Per Month</option>
            <option value="hour">Per Hour</option>
          </select>
        </div>
      </div>
      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
        {isEdit ? 'Update Service' : 'Create Service'}
      </button>
    </form>
  );
}
