// Exporta la base de datos SQLite a archivos JSON estáticos en public/data/
// Esto permite que el sitio funcione como estático en Cloudflare sin APIs.
//
// Uso:
//   bun run scripts/export-data.ts
//
// Genera:
//   public/data/businesses.json        → lista de todos los negocios (sin productos)
//   public/data/categories.json        → categorías con conteo de negocios
//   public/data/businesses/<slug>.json → detalle de cada negocio + productos
//   public/data/recommendations/<slug>.json → recomendaciones por negocio
//   public/data/stats.json             → estadísticas globales
import { db } from '../src/lib/db'
import { promises as fs } from 'fs'
import path from 'path'
import { parseBadges } from '../src/lib/badges'

const PUBLIC_DATA = path.join(process.cwd(), 'public', 'data')
const BIZ_DIR = path.join(PUBLIC_DATA, 'businesses')
const REC_DIR = path.join(PUBLIC_DATA, 'recommendations')

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true })
}

async function writeJson(filePath: string, data: unknown) {
  await fs.writeFile(filePath, JSON.stringify(data), 'utf-8')
  console.log(`  ✅ ${path.relative(process.cwd(), filePath)}`)
}

async function main() {
  console.log('📦 Exportando datos a JSON estático...\n')

  await ensureDir(PUBLIC_DATA)
  await ensureDir(BIZ_DIR)
  await ensureDir(REC_DIR)

  // 1. Categorías con conteo (solo negocios visibles)
  console.log('📁 Categorías...')
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { businesses: { where: { active: true, hidden: false } } } } },
  })
  await writeJson(path.join(PUBLIC_DATA, 'categories.json'), { categories })

  // 2. Stats globales (solo negocios visibles, no ocultos)
  console.log('📊 Stats...')
  const [businessesCount, categoriesCount, productsCount] = await Promise.all([
    db.business.count({ where: { active: true, hidden: false } }),
    db.category.count(),
    db.product.count({ where: { hidden: false, business: { active: true, hidden: false } } }),
  ])
  await writeJson(path.join(PUBLIC_DATA, 'stats.json'), {
    businesses: businessesCount,
    categories: categoriesCount,
    products: productsCount,
  })

  // 3. Lista de negocios (incluye productos para búsqueda en cliente)
  // Excluye los marcados como hidden (demo ocultos)
  console.log('🏪 Lista de negocios...')
  const businessesRaw = await db.business.findMany({
    where: { active: true, hidden: false },
    include: {
      category: true,
      _count: { select: { products: true } },
      products: { select: { id: true, name: true, description: true } },
    },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })
  // Transformar badges de string a array
  const businesses = businessesRaw.map((b) => ({
    ...b,
    badges: parseBadges(b.badges),
  }))
  await writeJson(path.join(PUBLIC_DATA, 'businesses.json'), { businesses })

  // 4. Detalle por negocio + recomendaciones
  console.log('🔍 Detalle por negocio...')
  for (const b of businesses) {
    const businessRaw = await db.business.findUnique({
      where: { slug: b.slug },
      include: {
        category: true,
        products: { where: { hidden: false }, orderBy: { createdAt: 'asc' } },
      },
    })
    if (!businessRaw) continue
    const business = { ...businessRaw, badges: parseBadges(businessRaw.badges) }
    await writeJson(path.join(BIZ_DIR, `${b.slug}.json`), { business })

    // Recomendaciones: misma categoría (excluyendo actual), relleno con otros
    let recommendationsRaw = await db.business.findMany({
      where: {
        active: true,
        hidden: false,
        categoryId: business.categoryId,
        id: { not: business.id },
      },
      include: { category: true, _count: { select: { products: true } } },
      take: 4,
    })
    if (recommendationsRaw.length < 4) {
      const extra = await db.business.findMany({
        where: {
          active: true,
          hidden: false,
          id: { notIn: [business.id, ...recommendationsRaw.map((r) => r.id)] },
        },
        include: { category: true, _count: { select: { products: true } } },
        take: 4 - recommendationsRaw.length,
        orderBy: { featured: 'desc' },
      })
      recommendationsRaw = [...recommendationsRaw, ...extra]
    }
    const recommendations = recommendationsRaw.map((r) => ({
      ...r,
      badges: parseBadges(r.badges),
    }))
    await writeJson(path.join(REC_DIR, `${b.slug}.json`), { recommendations })
  }

  console.log(`\n🎉 Exportación completa: ${businesses.length} negocios, ${categories.length} categorías.`)
  console.log(`📂 Archivos en: ${path.relative(process.cwd(), PUBLIC_DATA)}/`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
