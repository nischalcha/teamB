import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const [
      locationsRes,
      servicesRes,
      eventsRes,
    ] = await Promise.all([
      payload.find({ collection: 'locations', limit: 1 }),
      payload.find({ collection: 'services', limit: 20 }),
      payload.find({
        collection: 'events',
        limit: 5,
        where: { startDate: { greater_than_equal: new Date().toISOString().split('T')[0] } },
        sort: 'startDate',
      }),
    ]);

    const pricingSummary = (servicesRes.docs as Array<{ name: string; category: string; price: number; pricingUnit: string; timing: string }>).map((s) => ({
      name: s.name,
      category: s.category,
      price: s.price,
      unit: s.pricingUnit,
      timing: s.timing,
    }));

    return NextResponse.json({
      name: 'Flash Sports Academy',
      tagline: "Nepal's premier tennis training academy",
      locations: locationsRes.docs.length,
      pricingSummary,
      upcomingEventsCount: eventsRes.totalDocs,
      contact: {
        instagram: 'https://www.instagram.com/flash_sports10/',
        facebook: 'https://www.facebook.com/flashsportsnepal/',
      },
      bookingUrl: '/availability',
      websiteBase: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
