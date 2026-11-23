/**
 * Script: fix-badges.ts
 *
 * Limpia el campo `badges` de todos los negocios en la BD.
 * Filtra solo los IDs de badges válidos y descarta cualquier otro
 * valor (como letras sueltas de un bug anterior donde se guardaron
 * con guiones en vez de comas).
 *
 * Uso: bun run scripts/fix-badges.ts
 */

import { db } from '../src/lib/db'
import { BADGES } from '../src/lib/badges'

const VALID_BADGE_IDS = new Set(BADGES.map((b) => b.id))

async function main() {
  console.log('🧹 Limpiando badges de todos los negocios...\n')

  const businesses = await db.business.findMany()
  console.log(`Encontrados: ${businesses.length} negocios\n`)

  let fixed = 0
  let unchanged = 0

  for (const business of businesses) {
    const rawBadges: string = (business.badges as unknown as string) ?? ''

    // Splitear por coma y limpiar espacios
    const badgesArray = rawBadges
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    // Filtrar solo los IDs válidos
    const cleanedBadges = badgesArray.filter((b) =>
      VALID_BADGE_IDS.has(b as (typeof BADGES)[number]['id']),
    )

    // Quitar duplicados manteniendo el orden
    const uniqueBadges = [...new Set(cleanedBadges)]

    // String final para guardar en la BD
    const finalString = uniqueBadges.join(',')

    const wasDirty = rawBadges !== finalString

    if (wasDirty) {
      console.log(`🔧 ${business.name} (${business.slug}):`)
      console.log(`   Antes:    "${rawBadges}"`)
      console.log(`   Después:  "${finalString}"`)

      await db.business.update({
        where: { id: business.id },
        data: { badges: finalString },
      })
      fixed++
    } else {
      unchanged++
    }
  }

  console.log(`\n========================================`)
  console.log(`✅ Proceso completado`)
  console.log(`   Negocios arreglados: ${fixed}`)
  console.log(`   Negocios sin cambios: ${unchanged}`)
  console.log(`========================================`)
  console.log(`\n📌 Siguiente paso: regenera el JSON con`)
  console.log(`   bun run scripts/export-data.ts`)
  console.log(`   o el botón verde del panel admin`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
