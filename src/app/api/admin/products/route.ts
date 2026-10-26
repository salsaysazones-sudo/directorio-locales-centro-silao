import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

function checkAuth(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${ADMIN_TOKEN}`
}

const FREE_PLAN_LIMIT = 5
const PREMIUM_PLAN_LIMIT = 20

// Crear producto
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { name, description, price, image, tag, businessId } = body
    if (!name || !businessId || price === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Verificar límite del plan
    const business = await db.business.findUnique({
      where: { id: businessId },
      select: { plan: true, name: true },
    })
    if (!business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
    }

    const currentCount = await db.product.count({ where: { businessId } })
    const limit = business.plan === 'premium' ? PREMIUM_PLAN_LIMIT : FREE_PLAN_LIMIT

    if (currentCount >= limit) {
      const planName = business.plan === 'premium' ? 'Premium' : 'Gratis'
      return NextResponse.json({
        error: `Límite alcanzado: ${planName} permite máximo ${limit} productos. ${business.name} ya tiene ${currentCount}.`,
      }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        image: image || '',
        tag: tag || null,
        businessId,
      },
    })
    return NextResponse.json({ product })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
