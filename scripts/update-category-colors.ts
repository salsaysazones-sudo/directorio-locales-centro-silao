// Actualiza los colores de las 6 categorías existentes a la paleta Buen Fin
// (Negro/Dorado/Plateado). Se ejecuta UNA sola vez.
// Uso: bun run scripts/update-category-colors.ts
import { db } from '../src/lib/db'

// Paleta metálica Buen Fin (debe coincidir con scripts/seed.ts)
const nuevaPaleta = [
  { slug: 'restaurantes', color: '#B8860B' },       // oro oscuro
  { slug: 'belleza', color: '#B76E79' },            // oro rosa
  { slug: 'tiendas', color: '#9CA3AF' },            // plateado
  { slug: 'servicios', color: '#CD7F32' },          // bronce
  { slug: 'salud', color: '#E6C878' },              // champán
  { slug: 'artistas-eventos', color: '#D4AF37' },   // dorado
]

async function main() {
  console.log('')
  console.log('============================================')
  console.log('  Actualizando colores de categorías')
  console.log('  Tema: Buen Fin (Negro/Dorado/Plateado)')
  console.log('============================================')
  console.log('')

  let actualizadas = 0
  let noEncontradas = 0

  for (const { slug, color } of nuevaPaleta) {
    const existente = await db.category.findUnique({ where: { slug } })
    if (!existente) {
      console.log(`  ⚠️  No encontrada: "${slug}" (se omite)`)
      noEncontradas++
      continue
    }
    await db.category.update({
      where: { slug },
      data: { color },
    })
    console.log(`  ✅ ${existente.name.padEnd(22)} ${existente.color} → ${color}`)
    actualizadas++
  }

  console.log('')
  console.log('============================================')
  console.log(`  Resumen: ${actualizadas} actualizadas, ${noEncontradas} no encontradas`)
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
