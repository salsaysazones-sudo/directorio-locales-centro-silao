import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [businesses, categories, products] = await Promise.all([
      db.business.count({ where: { active: true } }),
      db.category.count(),
      db.product.count(),
    ])
    return NextResponse.json({ businesses, categories, products })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
