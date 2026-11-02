'use client'
import { useState, useMemo } from 'react'
import { Play, Video, ExternalLink } from 'lucide-react'
import { trackEvent } from './GoogleAnalytics'

interface BusinessVideoProps {
  videoUrl: string
  businessName: string
  businessSlug: string
}

type ParsedVideo =
  | { provider: 'youtube'; id: string; isShort: boolean }
  | { provider: 'tiktok'; id: string }
  | null

function parseVideoUrl(url: string): ParsedVideo {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube: youtube.com/watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      let id: string | null = null
      let isShort = false
      if (host === 'youtu.be') {
        id = u.pathname.slice(1)
      } else if (u.pathname.startsWith('/shorts/')) {
        id = u.pathname.split('/')[2] || ''
        isShort = true
      } else if (u.pathname.startsWith('/embed/')) {
        id = u.pathname.split('/')[2] || ''
      } else if (u.searchParams.get('v')) {
        id = u.searchParams.get('v')
      }
      if (id) return { provider: 'youtube', id, isShort }
    }

    // TikTok: tiktok.com/@user/video/ID
    if (host === 'tiktok.com' || host === 'vm.tiktok.com' || host === 'vt.tiktok.com') {
      const parts = u.pathname.split('/').filter(Boolean)
      // /@user/video/1234567890
      const videoIdx = parts.findIndex((p) => p === 'video')
      if (videoIdx !== -1 && parts[videoIdx + 1]) {
        return { provider: 'tiktok', id: parts[videoIdx + 1] }
      }
    }
  } catch {
    // URL inválida
  }
  return null
}

export function BusinessVideo({ videoUrl, businessName, businessSlug }: BusinessVideoProps) {
  const [playing, setPlaying] = useState(false)

  const parsed = useMemo(() => parseVideoUrl(videoUrl), [videoUrl])

  const handlePlay = () => {
    setPlaying(true)
    trackEvent('play_business_video', {
      business_slug: businessSlug,
      business_name: businessName,
      provider: parsed?.provider || 'unknown',
    })
  }

  if (!parsed) {
    // URL no reconocida: mostrar como enlace externo
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Ver video de {businessName}
      </a>
    )
  }

  const embedUrl =
    parsed.provider === 'youtube'
      ? `https://www.youtube.com/embed/${parsed.id}?autoplay=1&rel=0&playsinline=1`
      : `https://www.tiktok.com/embed/v2/${parsed.id}`

  // Shorts y TikTok son verticales; videos normales de YouTube son 16:9
  const isVertical = parsed.provider === 'tiktok' || (parsed.provider === 'youtube' && parsed.isShort)

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-100 text-pink-600">
          <Video className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Video del negocio</h3>
          <p className="text-[11px] text-slate-400 leading-tight">Exclusivo Plan Premium</p>
        </div>
      </div>

      <div
        className={`relative bg-black rounded-2xl overflow-hidden shadow-card mx-auto ${
          isVertical ? 'max-w-[320px]' : 'w-full'
        }`}
        style={isVertical ? { aspectRatio: '9 / 16' } : { aspectRatio: '16 / 9' }}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            title={`Video de ${businessName}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <button
            onClick={handlePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center group"
            aria-label={`Reproducir video de ${businessName}`}
          >
            {/* Thumbnail para YouTube */}
            {parsed.provider === 'youtube' && (
              <img
                src={`https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`}
                alt={businessName}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            )}
            {/* Fondo para TikTok (sin thumbnail disponible) */}
            {parsed.provider === 'tiktok' && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
            )}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-pink-600 fill-pink-600 ml-1" />
              </div>
              <span className="text-white text-xs font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                {parsed.provider === 'youtube'
                  ? parsed.isShort ? 'Ver YouTube Short' : 'Ver video'
                  : 'Ver TikTok'}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
