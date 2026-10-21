// Script para ocultar demos excepto Barbería El Navaja y Da bbq Pit
import { db } from '../src/lib/db'

const KEEP_VISIBLE = ['barberia-el-navaja', 'da-bbq-pit', 'camaron-wash']

async function main() {
  console.log('🙈 Ocultando negocios demo...\n')

  const all = await db.business.findMany({ select: { id: true, name: true, slug: true, hidden: true } })
  console.log(`Total de negocios: ${all.length}`)

  let hiddenCount = 0
  let visibleCount = 0

  for (const b of all) {
    const shouldHide = !KEEP_VISIBLE.includes(b.slug)
    if (shouldHide !== b.hidden) {
      await db.business.update({
        where: { id: b.id },
        data: { hidden: shouldHide },
      })
      const status = shouldHide ? '🙈 oculto' : '👁️ visible'
      console.log(`  ${status}: ${b.name}`)
    }
    if (shouldHide) hiddenCount++
    else visibleCount++
  }

  console.log(`\n✅ Listo:`)
  console.log(`   - Ocultos: ${hiddenCount}`)
  console.log(`   - Visibles: ${visibleCount}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
