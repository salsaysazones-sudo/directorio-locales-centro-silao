import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { businesses: true } } },
    })
    return NextResponse.json({ categories })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}
