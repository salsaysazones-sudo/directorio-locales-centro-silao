'use client'
import type { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  active: string // 'all' | categoryId
  onChange: (value: string) => void
  counts?: Record<string, number>
}

export function CategoryFilter({ categories, active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        onClick={() => onChange('all')}
        className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
          active === 'all'
            ? 'bg-slate-900 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => {
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
            style={{
              background: isActive ? cat.color : 'white',
              color: isActive ? 'white' : '#475569',
              border: `1px solid ${isActive ? cat.color : '#e2e8f0'}`,
            }}
          >
            <span>{cat.icon}</span>
            {cat.name}
            {counts && counts[cat.id] !== undefined && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : `${cat.color}20`,
                  color: isActive ? 'white' : cat.color,
                }}
              >
                {counts[cat.id]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
