import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    const category = searchParams.get('category')?.trim() || ''
    const featured = searchParams.get('featured') === '1'

    const where: Record<string, unknown> = { active: true }
    if (category) where.categoryId = category
    if (featured) where.featured = true
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
      ]
    }

    const businesses = await db.business.findMany({
      where,
      include: { category: true, _count: { select: { products: true } } },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    })

    return NextResponse.json({ businesses })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener negocios' }, { status: 500 })
  }
}
