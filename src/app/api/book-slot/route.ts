import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM',
  '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM',
];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'You must be logged in to book a slot.' }, { status: 401 });
    }

    const body = await request.json();
    const locationId = body?.locationId != null ? String(body.locationId) : '';
    const courtType = body?.courtType as string;
    const date = body?.date as string;
    const timeSlot = body?.timeSlot as string;

    if (!locationId || !courtType || !date || !timeSlot) {
      return NextResponse.json({ success: false, message: 'Missing required booking details (locationId, courtType, date, timeSlot).' }, { status: 400 });
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
      return NextResponse.json({ success: false, message: 'Invalid time slot.' }, { status: 400 });
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

    if (!location) {
      return NextResponse.json({ success: false, message: 'Location not found.' }, { status: 404 });
    }

    const courts = (location.courts as Array<{ courtType: string; availableSlots: number }>) || [];
    const matchingCourt = courts.find((c) => c.courtType === courtType);
    const maxSlots = matchingCourt?.availableSlots ?? 1;

    if (existing.totalDocs >= maxSlots) {
      return NextResponse.json({ success: false, message: 'This slot is fully booked. Please choose another.' }, { status: 409 });
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
      return NextResponse.json({ success: false, message: 'You have already booked this slot.' }, { status: 409 });
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

    return NextResponse.json({ success: true, message: 'Slot booked successfully!' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
