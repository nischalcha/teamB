import { getPayload } from 'payload';
import config from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const payload = await getPayload({ config });
    const where: { age?: { greater_than_equal?: number; less_than_equal?: number } } = {};
    if (minAge != null && minAge !== '') {
      where.age = { ...where.age, greater_than_equal: Number(minAge) };
    }
    if (maxAge != null && maxAge !== '') {
      where.age = { ...where.age, less_than_equal: Number(maxAge) };
    }
    const { docs } = await payload.find({
      collection: 'players',
      limit,
      depth: 1,
      ...(Object.keys(where).length > 0 && { where }),
    });
    const players = docs.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      age: p.age,
      birthday: p.birthday,
      profileImage: p.profileImage && typeof p.profileImage === 'object' && 'url' in p.profileImage ? (p.profileImage as { url: string }).url : null,
    }));
    return NextResponse.json({ players });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
