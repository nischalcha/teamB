import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'locations',
      limit: 50,
      depth: 0,
    });
    const locations = docs.map((loc) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      address: loc.address,
      courts: (loc.courts as Array<{ courtType: string; timing: string; availableSlots: number; level: string }>) || [],
    }));
    return NextResponse.json({ locations });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
