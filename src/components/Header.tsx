'use client'
import { Store } from 'lucide-react'

interface HeaderProps {
  onSearch?: (q: string) => void
  onGoHome: () => void
  onGoAdmin: () => void
  initialQuery?: string
}

// El botón "Admin" fue removido del header por seguridad.
// El panel de administración solo es accesible via URL: /?admin=1
// Esto evita que visitantes casuales encuentren el panel accidentalmente.

export function Header({ onGoHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo (clickeable, lleva al home) */}
          <button onClick={onGoHome} className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base sm:text-xl tracking-tight hidden sm:block">
              Directorio<span className="gradient-text"> Silao</span>
            </span>
          </button>

          <div className="flex-1" />
        </div>
      </div>
    </header>
  )
}
