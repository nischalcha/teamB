'use server';

import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface SlotBookingResult {
  success: boolean;
  message: string;
}

export async function bookSlotAction(formData: FormData): Promise<SlotBookingResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'You must be logged in to book a slot.' };
  }

  const locationId = formData.get('locationId') as string;
  const courtType = formData.get('courtType') as string;
  const date = formData.get('date') as string;
  const timeSlot = formData.get('timeSlot') as string;

  if (!locationId || !courtType || !date || !timeSlot) {
    return { success: false, message: 'Missing required booking details.' };
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { location: { equals: Number(locationId) } },
        { courtType: { equals: courtType } },
        { date: { equals: date } },
        { timeSlot: { equals: timeSlot } },
        { status: { equals: 'confirmed' } },
      ],
    },
    limit: 0,
  });

  const location = await payload.findByID({
    collection: 'locations',
    id: Number(locationId),
    depth: 0,
  });

  const courts = (location.courts as Array<{ courtType: string; availableSlots: number }>) || [];
  const matchingCourt = courts.find((c) => c.courtType === courtType);
  const maxSlots = matchingCourt?.availableSlots ?? 1;

  if (existing.totalDocs >= maxSlots) {
    return { success: false, message: 'This slot is fully booked. Please choose another.' };
  }

  const alreadyBooked = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { user: { equals: user.id } },
        { location: { equals: Number(locationId) } },
        { date: { equals: date } },
        { timeSlot: { equals: timeSlot } },
        { status: { equals: 'confirmed' } },
      ],
    },
    limit: 1,
  });

  if (alreadyBooked.totalDocs > 0) {
    return { success: false, message: 'You have already booked this slot.' };
  }

  await payload.create({
    collection: 'bookings',
    data: {
      user: user.id as number,
      userName: user.name,
      userEmail: user.email,
      location: Number(locationId),
      courtType: courtType as 'clay' | 'mini',
      date,
      timeSlot,
      status: 'confirmed',
    },
  });

  revalidatePath('/availability');
  return { success: true, message: 'Slot booked successfully!' };
}

export async function cancelBookingAction(bookingId: number | string): Promise<SlotBookingResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'You must be logged in.' };
  }

  const payload = await getPayload({ config });

  const booking = await payload.findByID({
    collection: 'bookings',
    id: Number(bookingId),
    depth: 0,
  });

  if (!booking) {
    return { success: false, message: 'Booking not found.' };
  }

  const ownerId = typeof booking.user === 'object' ? (booking.user as { id: number }).id : booking.user;
  if (ownerId !== user.id) {
    return { success: false, message: 'You can only cancel your own bookings.' };
  }

  if (booking.status === 'cancelled') {
    return { success: false, message: 'This booking is already cancelled.' };
  }

  await payload.update({
    collection: 'bookings',
    id: Number(bookingId),
    data: { status: 'cancelled' },
  });

  revalidatePath('/dashboard/bookings');
  revalidatePath('/availability');
  return { success: true, message: 'Booking cancelled successfully.' };
}

export async function getBookingsForDate(
  locationId: number | string,
  date: string,
): Promise<Record<string, number>> {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { location: { equals: Number(locationId) } },
        { date: { equals: date } },
        { status: { equals: 'confirmed' } },
      ],
    },
    limit: 200,
  });

  const counts: Record<string, number> = {};
  for (const booking of docs) {
    const key = `${booking.courtType}::${booking.timeSlot}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
