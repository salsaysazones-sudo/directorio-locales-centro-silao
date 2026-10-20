import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

function checkAuth(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${ADMIN_TOKEN}`
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(_req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    const business = await db.business.findUnique({
      where: { id },
      include: { category: true, products: true },
    })
    if (!business) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ business })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener negocio' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await req.json()
    const { name, slug, description, logo, cover, phone, whatsapp, email, address, city, hours, facebook, instagram, tiktok, website, featured, active, plan, categoryId } = body

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const dup = await db.business.findUnique({ where: { slug } })
    if (dup && dup.id !== id) {
      return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 400 })
    }

    const business = await db.business.update({
      where: { id },
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
        active: active !== undefined ? Boolean(active) : true,
        plan: plan === 'premium' ? 'premium' : 'gratis',
        categoryId,
      },
    })

    return NextResponse.json({ business })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al actualizar negocio' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    // Elimina productos en cascada y luego el negocio
    await db.product.deleteMany({ where: { businessId: id } })
    await db.business.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al eliminar negocio' }, { status: 500 })
  }
}
