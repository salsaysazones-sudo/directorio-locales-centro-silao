'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, TrendingUp, Store, Package, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import type { Business, Category } from '@/lib/types'
import { BusinessCard } from './BusinessCard'
import { CategoryFilter } from './CategoryFilter'
import { ProductCard } from './ProductCard'

interface DirectoryHomeProps {
  onOpenBusiness: (slug: string) => void
  initialQuery?: string
  onSearchChange?: (q: string) => void
}

export function DirectoryHome({ onOpenBusiness, initialQuery = '', onSearchChange }: DirectoryHomeProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState(initialQuery)
  const [stats, setStats] = useState({ businesses: 0, categories: 0, products: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [biz, cats, st] = await Promise.all([
        api.listBusinesses({ q: query }),
        api.listCategories(),
        api.getStats(),
      ])
      setBusinesses(biz.businesses)
      setCategories(cats.categories)
      setStats(st)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { load() }, [load])

  // Cuenta por categoría
  const counts: Record<string, number> = {}
  for (const c of categories) counts[c.id] = 0
  for (const b of businesses) {
    if (b.categoryId && counts[b.categoryId] !== undefined) counts[b.categoryId]++
  }

  // Filtrado en cliente
  const filteredBusinesses = activeCategory === 'all'
    ? businesses
    : businesses.filter((b) => b.categoryId === activeCategory)

  const featured = businesses.filter((b) => b.featured).slice(0, 4)

  const handleSearch = (q: string) => {
    setQuery(q)
    onSearchChange?.(q)
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-brand-soft">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold text-pink-600 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {stats.businesses} negocios activos · {stats.products} productos
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Descubre, comparte
              <br />
              <span className="gradient-text">negocios locales</span> del centro de silao
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Encuentra negocios, explora sus productos y comparte sus páginas con tus amigos
              por WhatsApp, Facebook, TikTok e Instagram.
              
            </p>

            {/* Search hero */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(query) }}
              className="mt-8 max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); onSearchChange?.(e.target.value) }}
                  placeholder="Busca un negocio, producto o servicio..."
                  className="w-full pl-12 pr-32 py-4 bg-white rounded-2xl text-sm font-medium shadow-card border border-slate-100 focus:ring-4 focus:ring-pink-100 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Buscar
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">Populares:</span>
              {['Restaurantes', 'Pizza', 'Belleza', 'Tech', 'Spa'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 rounded-full bg-white/70 hover:bg-white border border-slate-200 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* DESTACADOS */}
      {featured.length > 0 && !query && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Negocios destacados</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((b, i) => (
              <BusinessCard key={b.id} business={b} index={i} onClick={() => onOpenBusiness(b.slug)} />
            ))}
          </div>
        </section>
      )}

      {/* LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-pink-600" />
              {query ? `Resultados para "${query}"` : 'Todos los negocios'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'negocio' : 'negocios'} disponibles
            </p>
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                <div className="h-40 bg-slate-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-card flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos negocios</h3>
            <p className="text-sm text-slate-500 mb-4">Prueba con otra búsqueda o categoría</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('all'); handleSearch('') }}
              className="px-5 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold"
            >
              Ver todos los negocios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBusinesses.map((b, i) => (
              <BusinessCard key={b.id} business={b} index={i} onClick={() => onOpenBusiness(b.slug)} />
            ))}
          </div>
        )}
      </section>

      {/* CTA footer banner */}
      {!query && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 sm:p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
                  ¿Tu negocio no está aquí?
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Únete al directorio y recibe tu propia URL para compartir en redes sociales.
                  Tus clientes podrán ver tu catálogo completo y descubrir otros negocios de la comunidad.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
                <a
                  href="?admin=1"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-pink-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Registrar mi negocio
                </a>
                <span className="text-sm text-white/80 flex items-center gap-1">
                  Sin costos ocultos
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
