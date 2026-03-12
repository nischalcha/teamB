import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({ collection: 'services', limit: 50, depth: 0 });
    const services = docs.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      category: s.category,
      price: s.price,
      pricingUnit: s.pricingUnit,
      timing: s.timing,
    }));
    return NextResponse.json({ services });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
