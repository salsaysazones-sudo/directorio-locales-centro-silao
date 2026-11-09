import { db } from '../src/lib/db'

async function main() {
  const cats = await db.category.findMany({ orderBy: { name: 'asc' } })
  console.log('=== Categorías en la BD ===')
  for (const c of cats) {
    console.log(`slug: "${c.slug}" | name: "${c.name}" | icon: "${c.icon}" | color: "${c.color}"`)
  }
  console.log(`\nTotal: ${cats.length} categorías`)
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
