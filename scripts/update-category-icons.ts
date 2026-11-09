/**
 * Actualiza íconos, colores y nombres de productos en la BD existente.
 * Reemplaza al anterior update-category-colors.ts (que solo cambiaba colores).
 *
 * Uso: bun run scripts/update-category-icons.ts
 */
import { db } from '../src/lib/db'

const actualizaciones = [
  { slug: 'restaurantes',     icon: '◆', color: '#B8860B' },
  { slug: 'belleza',          icon: '✦', color: '#B76E79' },
  { slug: 'tiendas',          icon: '◉', color: '#9CA3AF' },
  { slug: 'servicios',        icon: '▲', color: '#CD7F32' },
  { slug: 'salud',            icon: '✚', color: '#E6C878' },
  { slug: 'artistas-eventos', icon: '❖', color: '#D4AF37' },
]

const productosARenombrar = [
  {
    nombreActual: 'Libreta temática (Día de Muertos)',
    nuevoNombre: 'Libreta temática artística',
    nuevaDescripcion: 'Libreta con diseños artísticos especiales: figuras, flores y patrones decorativos. Edición especial.',
  },
  {
    nombreActual: 'Maquillaje de Día de Muertos (Catrina)',
    nuevoNombre: 'Maquillaje artístico temático',
    nuevaDescripcion: 'Maquillaje artístico temático con diseños florales, detalles decorativos y brillantina. Perfecto para eventos y festividades.',
  },
]

async function main() {
  console.log('▶ Actualizando íconos y colores de categorías...')
  for (const { slug, icon, color } of actualizaciones) {
    const r = await db.category.updateMany({ where: { slug }, data: { icon, color } })
    console.log(`  ✓ ${slug}: icon='${icon}' color='${color}' (${r.count})`)
  }
  console.log('\n▶ Renombrando productos de Día de Muertos...')
  for (const { nombreActual, nuevoNombre, nuevaDescripcion } of productosARenombrar) {
    const r = await db.product.updateMany({ where: { name: nombreActual }, data: { name: nuevoNombre, description: nuevaDescripcion } })
    console.log(`  ✓ "${nombreActual}" → "${nuevoNombre}" (${r.count})`)
  }
  console.log('\n✅ Listo. Ahora regenera el JSON (botón verde del admin o: bun run scripts/export-data.ts)')
}

main().catch((e) => { console.error('❌', e); throw e }).finally(async () => { await db.$disconnect() })

