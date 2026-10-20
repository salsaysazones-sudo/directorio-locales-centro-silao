'use client'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

interface WhatsAppButtonProps {
  phone: string
  businessName: string
  color?: string
}

export function WhatsAppButton({ phone, businessName, color = '#25D366' }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false)

  const message = encodeURIComponent(`¡Hola ${businessName}! 😊 Vi su catálogo en Plaza SV y me gustaría más información.`)
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-card-hover p-4 max-w-xs border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-slate-900 text-sm">¿Necesitas más info?</h4>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Conversemos por WhatsApp. Te respondemos enseguida.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
            style={{ background: color }}
          >
            Abrir WhatsApp
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-glow flex items-center justify-center text-white hover:scale-105 transition-transform"
        style={{ background: color }}
        aria-label="Contactar por WhatsApp"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7 fill-white/20" />}
      </button>
    </div>
  )
}
