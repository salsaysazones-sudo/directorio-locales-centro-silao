import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const business = await db.business.findUnique({
      where: { slug },
      include: { category: true, products: { orderBy: { createdAt: 'asc' } } },
    })
    if (!business || !business.active) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ business })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener el negocio' }, { status: 500 })
  }
}
