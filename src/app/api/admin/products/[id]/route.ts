import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

function checkAuth(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${ADMIN_TOKEN}`
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
    const { name, description, price, image, tag, hidden } = body
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        image: image || '',
        tag: tag || null,
        hidden: hidden !== undefined ? Boolean(hidden) : undefined,
      },
    })
    return NextResponse.json({ product })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
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
    await db.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
