import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Recomendaciones: negocios de la misma categoría (excluyendo el actual)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '4', 10)

    if (!slug) {
      return NextResponse.json({ error: 'Falta parámetro slug' }, { status: 400 })
    }

    const current = await db.business.findUnique({
      where: { slug },
      select: { id: true, categoryId: true },
    })
    if (!current) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
    }

    // Primero intenta misma categoría
    let recommendations = await db.business.findMany({
      where: {
        active: true,
        categoryId: current.categoryId,
        id: { not: current.id },
      },
      include: { category: true, _count: { select: { products: true } } },
      take: limit,
    })

    // Si no hay suficientes, completa con otros destacados
    if (recommendations.length < limit) {
      const extraNeeded = limit - recommendations.length
      const excludeIds = [current.id, ...recommendations.map((b) => b.id)]
      const extra = await db.business.findMany({
        where: {
          active: true,
          id: { notIn: excludeIds },
        },
        include: { category: true, _count: { select: { products: true } } },
        take: extraNeeded,
        orderBy: { featured: 'desc' },
      })
      recommendations = [...recommendations, ...extra]
    }

    return NextResponse.json({ recommendations })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener recomendaciones' }, { status: 500 })
  }
}
