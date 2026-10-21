'use client'
import { useState, useEffect } from 'react'
import { Eye, TrendingUp, BarChart3, RefreshCw, ArrowLeft } from 'lucide-react'
import type { Business } from '@/lib/types'

interface ViewStatsPanelProps {
  onBack: () => void
  onOpenBusiness: (slug: string) => void
}

/**
 * Panel de estadísticas de visitas (local, por dispositivo).
 * Lee del localStorage donde se guardan las vistas por slug.
 *
 * IMPORTANTE: esto solo cuenta visitas en ESTE navegador/dispositivo.
 * No es un conteo global real. Para eso se necesitaría un backend.
 *
 * Sirve como referencia para ver si tú (o quien use esta compu)
 * está visitando los negocios.
 */
export function ViewStatsPanel({ onBack, onOpenBusiness }: ViewStatsPanelProps) {
  const [views, setViews] = useState<Record<string, number>>({})
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      // Cargar vistas del localStorage
      const raw = typeof window !== 'undefined' ? localStorage.getItem('directorio-silao-views') || '{}' : '{}'
      setViews(JSON.parse(raw))

      // Cargar lista de negocios
      const res = await fetch('/data/businesses.json')
      const data = await res.json()
      setBusinesses(data.businesses || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalViews = Object.values(views).reduce((acc, v) => acc + v, 0)
  const businessesWithViews = businesses.filter(b => views[b.slug] > 0)
  const sortedByViews = [...businessesWithViews].sort((a, b) => (views[b.slug] || 0) - (views[a.slug] || 0))

  const resetStats = () => {
    if (typeof window !== 'undefined') {
      if (confirm('¿Seguro que quieres reiniciar todos los contadores de visitas?')) {
        localStorage.removeItem('directorio-silao-views')
        load()
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-slate-500">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al directorio
      </button>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pink-600" />
            Estadísticas de visitas
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Visitas registradas en este dispositivo
          </p>
        </div>
        <button
          onClick={resetStats}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          title="Reiniciar contadores"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reiniciar
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-100 text-pink-600">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total visitas</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalViews}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Negocios visitados</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{businessesWithViews.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Promedio por negocio</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {businessesWithViews.length > 0 ? Math.round(totalViews / businessesWithViews.length) : 0}
          </div>
        </div>
      </div>

      {/* Lista por negocio */}
      {businessesWithViews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Sin visitas registradas</h3>
          <p className="text-sm text-slate-500">
            Cuando alguien visite los negocios desde este dispositivo, las visitas aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Visitas por negocio</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {sortedByViews.map((b) => {
              const count = views[b.slug] || 0
              const percentage = totalViews > 0 ? (count / totalViews) * 100 : 0
              const color = b.category?.color || '#FF6B35'
              return (
                <button
                  key={b.id}
                  onClick={() => onOpenBusiness(b.slug)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {b.logo && <img src={b.logo} alt={b.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">{b.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {b.category?.icon} {b.category?.name} · {b.city}
                    </div>
                  </div>
                  <div className="hidden sm:block flex-1 max-w-xs">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percentage}%`, background: color }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold" style={{ color }}>{count}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {count === 1 ? 'visita' : 'visitas'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>ℹ️ Nota importante:</strong> estas estadísticas solo cuentan las visitas hechas
          desde <strong>este dispositivo y navegador</strong>. Como tu sitio es estático (gratis en Cloudflare),
          no hay un servidor que registre todas las visitas globales.
          Para un conteo real necesitarías un servicio como Google Analytics (gratis) o Plausible Analytics.
          Si quieres que lo agregue, dime y lo configuro.
        </p>
      </div>
    </div>
  )
}
