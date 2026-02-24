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

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  file: File,
  alt: string,
): Promise<number> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
  });
  return media.id;
}

async function handleSingleUpload(
  payload: Awaited<ReturnType<typeof getPayload>>,
  formData: FormData,
  fieldName: string,
  altText: string,
): Promise<number | undefined> {
  const file = formData.get(fieldName) as File | null;
  if (file && file.size > 0) {
    return uploadMedia(payload, file, altText);
  }
  return undefined;
}

async function handleMultipleUploads(
  payload: Awaited<ReturnType<typeof getPayload>>,
  formData: FormData,
  fieldName: string,
  altPrefix: string,
): Promise<{ image: number }[]> {
  const files = formData.getAll(fieldName) as File[];
  const uploaded: { image: number }[] = [];
  for (const file of files) {
    if (file.size > 0) {
      const id = await uploadMedia(payload, file, `${altPrefix} image`);
      uploaded.push({ image: id });
    }
  }
  return uploaded;
}

export async function deleteDocument(collection: CollectionSlug, id: number | string) {
  const payload = await getAuthenticatedPayload();
  await payload.delete({ collection, id });
  revalidatePath(`/admin-portal/${collection}`);
}

export async function createPlayer(formData: FormData) {
  const payload = await getAuthenticatedPayload();
  const name = formData.get('name') as string;
  const profileImageId = await handleSingleUpload(payload, formData, 'profileImage', `${name} profile`);

  await payload.create({
    collection: 'players',
    data: {
      name,
      slug: formData.get('slug') as string,
      birthday: formData.get('birthday') as string,
      age: 0,
      ...(profileImageId && { profileImage: profileImageId }),
    },
  });

  revalidatePath('/admin-portal/players');
  redirect('/admin-portal/players');
}

export async function updatePlayer(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();
  const name = formData.get('name') as string;
  const profileImageId = await handleSingleUpload(payload, formData, 'profileImage', `${name} profile`);

  const data: Record<string, unknown> = {
    name,
    slug: formData.get('slug') as string,
    birthday: formData.get('birthday') as string,
  };

  if (profileImageId) {
    data.profileImage = profileImageId;
  }

  await payload.update({
    collection: 'players',
    id,
    data,
  });

  revalidatePath('/admin-portal/players');
  redirect('/admin-portal/players');
}

export async function createLocation(formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const name = formData.get('name') as string;
  const courtsJson = formData.get('courts') as string;
  const courts = courtsJson ? JSON.parse(courtsJson) : [];
  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${name} thumbnail`);

  await payload.create({
    collection: 'locations',
    data: {
      name,
      slug: formData.get('slug') as string,
      address: formData.get('address') as string,
      courts,
      ...(thumbnailId && { thumbnail: thumbnailId }),
    },
  });

  revalidatePath('/admin-portal/locations');
  redirect('/admin-portal/locations');
}

export async function updateLocation(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();

  const name = formData.get('name') as string;
  const courtsJson = formData.get('courts') as string;
  const courts = courtsJson ? JSON.parse(courtsJson) : undefined;
  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${name} thumbnail`);

  const data: Record<string, unknown> = {
    name,
    slug: formData.get('slug') as string,
    address: formData.get('address') as string,
  };

  if (courts !== undefined) {
    data.courts = courts;
  }
  if (thumbnailId) {
    data.thumbnail = thumbnailId;
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
  const name = formData.get('name') as string;
  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${name} thumbnail`);

  await payload.create({
    collection: 'services',
    data: {
      name,
      slug: formData.get('slug') as string,
      category: formData.get('category') as 'adults' | 'kids',
      price: Number(formData.get('price')),
      pricingUnit: formData.get('pricingUnit') as 'month' | 'hour',
      timing: formData.get('timing') as 'morning' | 'evening',
      ...(thumbnailId && { thumbnail: thumbnailId }),
    },
  });

  revalidatePath('/admin-portal/services');
  redirect('/admin-portal/services');
}

export async function updateService(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();
  const name = formData.get('name') as string;
  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${name} thumbnail`);

  const data: Record<string, unknown> = {
    name,
    slug: formData.get('slug') as string,
    category: formData.get('category') as 'adults' | 'kids',
    price: Number(formData.get('price')),
    pricingUnit: formData.get('pricingUnit') as 'month' | 'hour',
    timing: formData.get('timing') as 'morning' | 'evening',
  };

  if (thumbnailId) {
    data.thumbnail = thumbnailId;
  }

  await payload.update({
    collection: 'services',
    id,
    data,
  });

  revalidatePath('/admin-portal/services');
  redirect('/admin-portal/services');
}

export async function createEvent(formData: FormData) {
  const payload = await getAuthenticatedPayload();
  const title = formData.get('title') as string;
  const locationId = formData.get('location');

  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${title} thumbnail`);
  const newImages = await handleMultipleUploads(payload, formData, 'images', title);

  await payload.create({
    collection: 'events',
    data: {
      title,
      slug: formData.get('slug') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      timing: formData.get('timing') as string,
      location: locationId ? Number(locationId) : 0,
      ...(thumbnailId && { thumbnail: thumbnailId }),
      ...(newImages.length > 0 && { images: newImages }),
    },
  });

  revalidatePath('/admin-portal/events');
  redirect('/admin-portal/events');
}

export async function updateEvent(id: number | string, formData: FormData) {
  const payload = await getAuthenticatedPayload();
  const title = formData.get('title') as string;
  const locationId = formData.get('location');

  const thumbnailId = await handleSingleUpload(payload, formData, 'thumbnail', `${title} thumbnail`);
  const newImages = await handleMultipleUploads(payload, formData, 'images', title);

  const existingImagesJson = formData.get('existingImages') as string;
  const existingImages: { image: number }[] = existingImagesJson ? JSON.parse(existingImagesJson) : [];
  const allImages = [...existingImages, ...newImages];

  const data: Record<string, unknown> = {
    title,
    slug: formData.get('slug') as string,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    timing: formData.get('timing') as string,
  };

  if (locationId) {
    data.location = Number(locationId);
  }
  if (thumbnailId) {
    data.thumbnail = thumbnailId;
  }
  if (allImages.length > 0) {
    data.images = allImages;
  }

  await payload.update({
    collection: 'events',
    id,
    data,
  });

  revalidatePath('/admin-portal/events');
  redirect('/admin-portal/events');
}
