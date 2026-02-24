'use server';

import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type CollectionSlug = 'players' | 'locations' | 'services' | 'events';

async function getAuthenticatedPayload() {
  const payload = await getPayload({ config });
  const headersList = await getHeaders();
  const { user } = await payload.auth({ headers: headersList });
  if (!user || (user as Record<string, unknown>).role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return payload;
}

export async function deleteDocument(collection: CollectionSlug, id: number | string) {
  const payload = await getAuthenticatedPayload();
  await payload.delete({ collection, id });
  revalidatePath(`/admin-portal/${collection}`);
}

export async function createPlayer(formData: FormData) {
  const payload = await getAuthenticatedPayload();

  await payload.create({
    collection: 'players',
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      birthday: formData.get('birthday') as string,
      age: 0,
    },
  });

  revalidatePath('/admin-portal/players');
  redirect('/admin-portal/players');
}

export async function updatePlayer(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();

  await payload.update({
    collection: 'players',
    id,
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      birthday: formData.get('birthday') as string,
    },
  });

  revalidatePath('/admin-portal/players');
  redirect('/admin-portal/players');
}

export async function createLocation(formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const courtsJson = formData.get('courts') as string;
  const courts = courtsJson ? JSON.parse(courtsJson) : [];

  await payload.create({
    collection: 'locations',
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      address: formData.get('address') as string,
      courts,
    },
  });

  revalidatePath('/admin-portal/locations');
  redirect('/admin-portal/locations');
}

export async function updateLocation(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const courtsJson = formData.get('courts') as string;
  const courts = courtsJson ? JSON.parse(courtsJson) : undefined;

  const data: Record<string, unknown> = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    address: formData.get('address') as string,
  };

  if (courts !== undefined) {
    data.courts = courts;
  }

  await payload.update({
    collection: 'locations',
    id,
    data,
  });

  revalidatePath('/admin-portal/locations');
  redirect('/admin-portal/locations');
}

export async function createService(formData: FormData) {
  const payload = await getAuthenticatedPayload();

  await payload.create({
    collection: 'services',
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      category: formData.get('category') as 'adults' | 'kids',
      price: Number(formData.get('price')),
      pricingUnit: formData.get('pricingUnit') as 'month' | 'hour',
      timing: formData.get('timing') as 'morning' | 'evening',
    },
  });

  revalidatePath('/admin-portal/services');
  redirect('/admin-portal/services');
}

export async function updateService(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();

  await payload.update({
    collection: 'services',
    id,
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      category: formData.get('category') as 'adults' | 'kids',
      price: Number(formData.get('price')),
      pricingUnit: formData.get('pricingUnit') as 'month' | 'hour',
      timing: formData.get('timing') as 'morning' | 'evening',
    },
  });

  revalidatePath('/admin-portal/services');
  redirect('/admin-portal/services');
}

export async function createEvent(formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const locationId = formData.get('location');

  await payload.create({
    collection: 'events',
    data: {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      timing: formData.get('timing') as string,
      location: locationId ? Number(locationId) : 0,
    },
  });

  revalidatePath('/admin-portal/events');
  redirect('/admin-portal/events');
}

export async function updateEvent(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const locationId = formData.get('location');

  const data: Record<string, unknown> = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    timing: formData.get('timing') as string,
  };

  if (locationId) {
    data.location = Number(locationId);
  }

  await payload.update({
    collection: 'events',
    id,
    data,
  });

  revalidatePath('/admin-portal/events');
  redirect('/admin-portal/events');
}
