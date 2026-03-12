import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
    const upcoming = searchParams.get('upcoming') !== 'false';
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'events',
      limit,
      depth: 1,
      sort: 'startDate',
      ...(upcoming && {
        where: { startDate: { greater_than_equal: new Date().toISOString().split('T')[0] } },
      }),
    });
    const events = docs.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      startDate: e.startDate,
      endDate: e.endDate,
      timing: e.timing,
      location: e.location && typeof e.location === 'object' && 'name' in e.location ? (e.location as { name: string }).name : null,
    }));
    return NextResponse.json({ events });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
