import { NextRequest, NextResponse } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-directorio-2026'

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { execSync } = await import('child_process')
    execSync('bun run /home/z/my-project/scripts/export-data.ts', {
      stdio: 'pipe',
      timeout: 60000,
    })
    return NextResponse.json({
      ok: true,
      message: 'Datos exportados correctamente. Ya puedes commitear y deployar.',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al exportar datos' }, { status: 500 })
  }
}
