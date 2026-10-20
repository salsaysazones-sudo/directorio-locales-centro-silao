import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${ADMIN_TOKEN}`
}

// Crear negocio
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { name, slug, description, logo, cover, phone, whatsapp, email, address, city, hours, facebook, instagram, tiktok, website, featured, plan, categoryId, products } = body

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const exists = await db.business.findUnique({ where: { slug } })
    if (exists) {
      return NextResponse.json({ error: 'El slug ya existe' }, { status: 400 })
    }

    const business = await db.business.create({
      data: {
        name,
        slug,
        description: description || '',
        logo: logo || '',
        cover: cover || '',
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        address: address || null,
        city: city || null,
        hours: hours || null,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        website: website || null,
        featured: Boolean(featured),
        plan: plan === 'premium' ? 'premium' : 'gratis',
        categoryId,
      },
    })

    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        await db.product.create({
          data: {
            name: p.name,
            description: p.description || null,
            price: parseFloat(p.price),
            image: p.image || '',
            tag: p.tag || null,
            businessId: business.id,
          },
        })
      }
    }

    return NextResponse.json({ business })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al crear negocio' }, { status: 500 })
  }
}

// Listar todos (admin, incluye inactivos)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const businesses = await db.business.findMany({
      include: { category: true, _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ businesses })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener negocios' }, { status: 500 })
  }
}
