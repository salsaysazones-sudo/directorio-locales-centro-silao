'use client'
import Link from 'next/link'
import { Store, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onSearch?: (q: string) => void
  onGoHome: () => void
  onGoAdmin: () => void
  initialQuery?: string
}

export function Header({ onGoHome, onGoAdmin }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button onClick={onGoHome} className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base sm:text-xl tracking-tight hidden sm:block">
              Directorio<span className="gradient-text"> Silao</span>
            </span>
          </button>

          <div className="flex-1" />

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={onGoHome}
              className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Explorar
            </button>
            <button
              onClick={onGoAdmin}
              className="px-4 py-2 text-sm font-semibold text-white gradient-brand rounded-xl hover:opacity-90 transition-opacity"
            >
              Admin
            </button>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => { onGoHome(); setMobileOpen(false) }}
                className="flex-1 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Explorar
              </button>
              <button
                onClick={() => { onGoAdmin(); setMobileOpen(false) }}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white gradient-brand rounded-xl"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

