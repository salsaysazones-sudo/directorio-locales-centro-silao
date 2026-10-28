import { NextRequest, NextResponse } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    // Llama al script de seed en background usando Bun
    const { execSync } = await import('child_process')
    execSync('bun run /home/porr1006/directorio-locales-centro-silao/scripts/seed.ts', {
      stdio: 'pipe',
      timeout: 60000,
    })
    return NextResponse.json({ ok: true, message: 'Datos restaurados correctamente' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al restaurar datos' }, { status: 500 })
  }
}
