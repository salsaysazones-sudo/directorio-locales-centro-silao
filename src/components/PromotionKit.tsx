'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  QrCode, Download, Image as ImageIcon, Copy, Check,
  Share2, Sparkles, ChevronDown, ChevronUp, MessageCircle,
} from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import type { Business } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface PromotionKitProps {
  business: Business
  publicUrl: string // URL completa del negocio: https://dominio.com/?b=slug
}

export function PromotionKit({ business, publicUrl }: PromotionKitProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const socialCardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Generar QR base (sin logo aún)
  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 800,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(setQrDataUrl).catch(console.error)
  }, [publicUrl])

  // Dibujar QR con logo en canvas
  const drawQrWithLogo = useCallback(async (size = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('No canvas ctx'))

      const img = new window.Image()
      img.onload = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0, size, size)

        // Logo al centro
        if (business.logo) {
          const logo = new window.Image()
          logo.crossOrigin = 'anonymous'
          logo.onload = () => {
            const logoSize = size * 0.18
            const x = (size - logoSize) / 2
            const y = (size - logoSize) / 2
            const padding = logoSize * 0.12
            // Fondo blanco detrás del logo
            ctx.fillStyle = 'white'
            ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2)
            ctx.drawImage(logo, x, y, logoSize, logoSize)
            resolve(canvas.toDataURL('image/png'))
          }
          logo.onerror = () => resolve(canvas.toDataURL('image/png'))
          logo.src = business.logo
        } else {
          resolve(canvas.toDataURL('image/png'))
        }
      }
      img.onerror = reject
      img.src = qrDataUrl
    })
  }, [qrDataUrl, business.logo])

  const handleDownloadQr = async () => {
    try {
      const dataUrl = await drawQrWithLogo(1200)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `qr-${business.slug}.png`
      link.click()
      toast({ title: '✅ QR descargado', description: `qr-${business.slug}.png guardado.` })
    } catch {
      toast({ title: 'Error', description: 'No se pudo generar el QR.', variant: 'destructive' })
    }
  }

  const handleDownloadSocial = async () => {
    if (!socialCardRef.current) return
    try {
      // Import dinámico para evitar SSR
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(socialCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `social-${business.slug}.png`
      link.click()
      toast({ title: '✅ Imagen social descargada', description: `Lista para Facebook/Instagram stories.` })
    } catch (e) {
      console.error(e)
      toast({ title: 'Error', description: 'No se pudo generar la imagen.', variant: 'destructive' })
    }
  }

  const promotionalText = `🏪 ${business.name}

${business.description}

📱 Ver catálogo completo: ${publicUrl}

${business.whatsapp ? `💬 WhatsApp: https://wa.me/${business.whatsapp}` : ''}`

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(promotionalText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: '✅ Texto copiado', description: 'Pégalo en WhatsApp o Facebook.' })
    } catch {
      toast({ title: 'Error', description: 'No se pudo copiar.', variant: 'destructive' })
    }
  }

  const handleShareAll = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          text: promotionalText,
          url: publicUrl,
        })
      } else {
        handleCopyText()
      }
    } catch {
      // user cancelled
    }
  }

  const cat = business.category
  const color = cat?.color || '#FF6B35'

  return (
    <section className="mt-10 bg-gradient-to-br from-slate-50 to-pink-50/40 rounded-3xl border border-pink-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 sm:px-8 py-5 flex items-center justify-between gap-4 hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
              Kit de promoción
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Gratis
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              QR descargable, imagen para redes y texto listo para compartir
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {open && (
        <div className="px-5 sm:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* QR */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Código QR</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl p-4 mb-3 min-h-[200px]">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR ${business.name}`} className="w-40 h-40" />
              ) : (
                <div className="w-40 h-40 bg-slate-200 animate-pulse rounded" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Imprime este QR en tu mostrador, menú o flyers. Apunta directo a tu catálogo.
            </p>
            <button
              onClick={handleDownloadQr}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar QR (PNG)
            </button>
          </div>

          {/* Imagen social */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Imagen para redes</h3>
            </div>
            <div className="flex-1 flex items-center justify-center mb-3 min-h-[200px]">
              <div
                ref={socialCardRef}
                className="w-full aspect-square rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-white p-5"
                style={{ background: `linear-gradient(135deg, ${color} 0%, #EC4899 50%, #8B5CF6 100%)` }}
              >
                {business.cover && (
                  <img
                    src={business.cover}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    crossOrigin="anonymous"
                  />
                )}
                <div className="relative z-10 text-center">
                  {business.logo && (
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-16 h-16 rounded-2xl mx-auto mb-3 border-2 border-white shadow-lg object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                  <h4 className="font-extrabold text-lg leading-tight mb-1">{business.name}</h4>
                  {cat && <p className="text-xs opacity-90 mb-3">{cat.icon} {cat.name}</p>}
                  <p className="text-[10px] font-mono bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full inline-block">
                    {publicUrl.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Imagen cuadrada lista para stories de Facebook e Instagram.
            </p>
            <button
              onClick={handleDownloadSocial}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: color }}
            >
              <Download className="w-3.5 h-3.5" />
              Descargar imagen (PNG)
            </button>
          </div>

          {/* Texto promocional */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Texto para compartir</h3>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-3 mb-3 min-h-[200px]">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {promotionalText}
              </pre>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Copia y pega en estados de WhatsApp, posts de Facebook o mensajes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyText}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={handleShareAll}
                className="px-3 py-2.5 gradient-brand text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                title="Compartir"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* URL del negocio */}
          <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                URL pública de tu negocio
              </p>
              <p className="text-sm font-mono text-white truncate">{publicUrl}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicUrl)
                toast({ title: '✅ URL copiada' })
              }}
              className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Copiar URL
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
