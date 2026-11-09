// Actualiza las 6 categorías existentes a la paleta + íconos Buen Fin (sin Día de Muertos)
// y renombra los 2 productos con texto de Día de Muertos a nombres neutros.
// Se ejecuta UNA sola vez.
// Uso: bun run scripts/update-category-colors.ts
import { db } from '../src/lib/db'

// Paleta + íconos refinados no estacionales (debe coincidir con scripts/seed.ts)
const categoriasNuevas = [
  { slug: 'restaurantes', icon: '🍽️', color: '#B8860B' },      // oro oscuro
  { slug: 'belleza', icon: '💅', color: '#B76E79' },           // oro rosa
  { slug: 'tiendas', icon: '👜', color: '#9CA3AF' },            // plateado
  { slug: 'servicios', icon: '🛠️', color: '#CD7F32' },         // bronce
  { slug: 'salud', icon: '🌿', color: '#E6C878' },             // champán
  { slug: 'artistas-eventos', icon: '🎭', color: '#D4AF37' },  // dorado
]

// Productos con texto de Día de Muertos -> nombres neutros
const productosARenombrar = [
  {
    nombreViejo: 'Libreta temática (Día de Muertos)',
    nombreNuevo: 'Libreta temática artesanal',
    descNueva:
      'Libreta con diseños temáticos únicos: ilustraciones detalladas, flores y patrones originales. Edición especial hecha a mano.',
  },
  {
    nombreViejo: 'Maquillaje de Día de Muertos (Catrina)',
    nombreNuevo: 'Maquillaje temático especial',
    descNueva:
      'Maquillaje temático para eventos y festividades. Diseños florales, decoración con brillantina y trabajos detallados con técnicas profesionales.',
  },
]

async function main() {
  console.log('')
  console.log('============================================')
  console.log('  Actualizando categorías + productos')
  console.log('  Tema: Buen Fin (sin Día de Muertos)')
  console.log('============================================')
  console.log('')

  // 1) Categorías: ícono + color
  let catsActualizadas = 0
  for (const { slug, icon, color } of categoriasNuevas) {
    const existente = await db.category.findUnique({ where: { slug } })
    if (!existente) {
      console.log(`  ⚠️  Categoría no encontrada: "${slug}" (se omite)`)
      continue
    }
    await db.category.update({
      where: { slug },
      data: { icon, color },
    })
    console.log(
      `  ✅ ${existente.name.padEnd(22)} ícono ${existente.icon} → ${icon}  |  color ${existente.color} → ${color}`
    )
    catsActualizadas++
  }

  console.log('')
  console.log('--- Productos: quitando referencias a Día de Muertos ---')

  // 2) Productos: renombrar los que mencionan Día de Muertos
  let prodsActualizados = 0
  for (const p of productosARenombrar) {
    const encontrados = await db.product.findMany({
      where: { name: { contains: p.nombreViejo } },
    })
    if (encontrados.length === 0) {
      console.log(`  ⚠️  Producto no encontrado: "${p.nombreViejo}" (¿ya renombrado?)`)
      continue
    }
    for (const prod of encontrados) {
      await db.product.update({
        where: { id: prod.id },
        data: { name: p.nombreNuevo, description: p.descNueva },
      })
      console.log(`  ✅ "${prod.name}" → "${p.nombreNuevo}"`)
      prodsActualizados++
    }
  }

  console.log('')
  console.log('============================================')
  console.log(`  Categorías: ${catsActualizadas} actualizadas`)
  console.log(`  Productos:  ${prodsActualizados} renombrados`)
  console.log('============================================')
  console.log('')
  console.log('Ahora regenera los JSON:')
  console.log('  1. Abre http://localhost:3000/?admin=1')
  console.log('  2. Botón verde "Generar deploy"')
  console.log('  3. luego ejecuta: subir')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
