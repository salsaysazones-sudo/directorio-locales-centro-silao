'use client'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
}

/**
 * Muestra cuántas veces se ha visitado este negocio.
 * Usa localStorage (cada navegador tiene su propio conteo).
 */
export function ViewCounter({ slug }: ViewCounterProps) {
  let views = 0
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('directorio-silao-views') || '{}'
      const data = JSON.parse(raw)
      views = data[slug] || 0
    } catch {
      views = 0
    }
  }

  if (views === 0) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
      <Eye className="w-3.5 h-3.5" />
      <span>
        {views} {views === 1 ? 'visita' : 'visitas'} en este dispositivo
      </span>
    </div>
  )
}
