import { Store, Heart } from 'lucide-react'

interface FooterProps {
  onGoHome: () => void
  onGoAdmin: () => void
  stats?: { businesses: number; categories: number }
}

export function Footer({ onGoHome, onGoAdmin, stats }: FooterProps) {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Directorio<span className="gradient-text"> Silao</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Directorio digital de los comercios del centro de Silao, Guanajuato.
              Cada negocio tiene su propia URL para compartir en redes sociales y
              atraer clientes directo a su catálogo.
            </p>
            {stats && (
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-2xl font-bold text-white">{stats.businesses}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Negocios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.categories}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Categorías</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={onGoHome} className="hover:text-white transition-colors">Explorar negocios</button></li>
              <li><button onClick={onGoAdmin} className="hover:text-white transition-colors">Panel de administración</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">¿Tienes un negocio?</h4>
            <p className="text-sm text-slate-400 mb-3">
              Únete al directorio y recibe tu propia URL para compartir en redes.
            </p>
            <a
              href={`https://wa.me/524775188447?text=${encodeURIComponent('¡Hola! 😊 Me gustaría registrar mi negocio en el Directorio de Silao. ¿Me pueden dar más información?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white gradient-brand px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Registrarme
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">© 2026 Directorio Locales Centro Silao. Todos los derechos reservados.</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> para negocios locales
          </p>
        </div>
      </div>
    </footer>
  )
}
