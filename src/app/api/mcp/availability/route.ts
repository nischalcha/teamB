import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    const date = searchParams.get('date');

    if (!locationId || !date) {
      return NextResponse.json(
        { error: 'Missing locationId or date (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });
    const location = await payload.findByID({
      collection: 'locations',
      id: Number(locationId),
      depth: 0,
    });

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const { docs } = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { location: { equals: Number(locationId) } },
          { date: { equals: date } },
          { status: { equals: 'confirmed' } },
        ],
      },
      limit: 500,
    });

    const counts: Record<string, number> = {};
    for (const b of docs) {
      const key = `${b.courtType}::${b.timeSlot}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    const courts = (location.courts as Array<{ courtType: string; availableSlots: number; timing?: string; level?: string }>) || [];
    const slots: Array<{ courtType: string; timeSlot: string; available: number; maxSlots: number }> = [];

    for (const court of courts) {
      const maxSlots = court.availableSlots ?? 0;
      for (const timeSlot of TIME_SLOTS) {
        const key = `${court.courtType}::${timeSlot}`;
        const booked = counts[key] || 0;
        const available = Math.max(0, maxSlots - booked);
        slots.push({
          courtType: court.courtType,
          timeSlot,
          available,
          maxSlots,
        });
      }
    }

    return NextResponse.json({
      locationId: Number(locationId),
      locationName: location.name,
      date,
      slots,
      courtTypes: [...new Set(courts.map((c) => c.courtType))],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
