'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Clock, Phone, Mail, Globe,
  Facebook, Instagram, Share2, Package, Store, ChevronRight, MessageCircle,
} from 'lucide-react'
import { api } from '@/lib/api'
import type { Business, Category, Product } from '@/lib/types'
import { ProductCard } from './ProductCard'
import { BusinessCard } from './BusinessCard'
import { WhatsAppButton } from './WhatsAppButton'
import { useToast } from '@/hooks/use-toast'

interface BusinessDetailProps {
  slug: string
  onBack: () => void
  onOpenBusiness: (slug: string) => void
}

export function BusinessDetail({ slug, onBack, onOpenBusiness }: BusinessDetailProps) {
  const [business, setBusiness] = useState<(Business & { products: Product[] }) | null>(null)
  const [recommendations, setRecommendations] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { toast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const [biz, recs] = await Promise.all([
        api.getBusiness(slug),
        api.getRecommendations(slug, 4),
      ])
      setBusiness(biz.business)
      setRecommendations(recs.recommendations)
    } catch (e) {
      console.error(e)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { load() }, [load])

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/?b=${slug}` : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: business?.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast({ title: 'Enlace copiado', description: 'Pégalo en tus redes sociales.' })
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-slate-100 animate-pulse rounded-3xl mb-6" />
        <div className="h-8 bg-slate-100 animate-pulse rounded w-1/2 mb-3" />
        <div className="h-4 bg-slate-100 animate-pulse rounded w-1/3 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Negocio no encontrado</h1>
        <p className="text-slate-500 mb-6">Puede que el enlace haya cambiado o ya no esté disponible.</p>
        <button onClick={onBack} className="px-5 py-2.5 gradient-brand text-white rounded-xl font-bold">
          Volver al directorio
        </button>
      </div>
    )
  }

  const cat = business.category
  const color = cat?.color || '#FF6B35'

  const whatsappHref = business.whatsapp
    ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`¡Hola ${business.name}! 😊 Vi su catálogo en Plaza SV y me gustaría más información.`)}`
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al directorio
      </button>

      {/* Cover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative h-48 sm:h-72 rounded-3xl overflow-hidden shadow-card mb-0"
      >
        {business.cover && (
          <img src={business.cover} alt={business.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartir
          </button>
        </div>
      </motion.div>

      {/* Header info */}
      <div className="bg-white rounded-b-3xl shadow-card border border-t-0 border-slate-100 px-5 sm:px-8 pb-6 pt-0 -mt-1">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-14">
          {/* Logo */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-card bg-white"
            style={{ boxShadow: `0 0 0 2px ${color}30` }}
          >
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ background: `${color}15`, color }}>
                {business.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 pt-3 sm:pt-0 sm:pb-2">
            {cat && (
              <a
                href={`/?category=${cat.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-2"
                style={{ background: `${color}15`, color }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </a>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {business.name}
            </h1>
            {business.featured && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-amber-600">
                ⭐ Negocio destacado
              </span>
            )}
          </div>

          {/* WhatsApp CTA */}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-glow"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span className="hidden sm:inline">Escribir por WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          )}
        </div>

        <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed">
          {business.description}
        </p>

        {/* Info grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {business.address && (
            <InfoItem icon={<MapPin className="w-4 h-4" />} label="Dirección" value={`${business.address}${business.city ? `, ${business.city}` : ''}`} color={color} />
          )}
          {business.hours && (
            <InfoItem icon={<Clock className="w-4 h-4" />} label="Horario" value={business.hours} color={color} />
          )}
          {business.phone && (
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Teléfono" value={business.phone} color={color} href={`tel:${business.phone}`} />
          )}
          {business.email && (
            <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={business.email} color={color} href={`mailto:${business.email}`} />
          )}
          {business.website && (
            <InfoItem icon={<Globe className="w-4 h-4" />} label="Sitio web" value={business.website.replace(/^https?:\/\//, '')} color={color} href={business.website} />
          )}
          {(business.facebook || business.instagram || business.tiktok) && (
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Redes sociales</span>
              <div className="flex gap-2 mt-1">
                {business.facebook && (
                  <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {business.instagram && (
                  <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {business.tiktok && (
                  <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity text-[10px] font-bold">
                    TT
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Catálogo */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5" style={{ color }} />
            Catálogo
            <span className="text-sm font-semibold text-slate-400">({business.products.length})</span>
          </h2>
        </div>
        {business.products.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Este negocio aún no tiene productos en su catálogo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.products.map((p, i) => (
              <ProductCard key={p.id} product={p} businessColor={color} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-pink-600" />
              También te puede gustar
            </h2>
            <button
              onClick={onBack}
              className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((b, i) => (
              <BusinessCard key={b.id} business={b} index={i} onClick={() => onOpenBusiness(b.slug)} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp flotante */}
      {business.whatsapp && (
        <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
      )}
    </div>
  )
}

function InfoItem({
  icon, label, value, color, href,
}: { icon: React.ReactNode; label: string; value: string; color: string; href?: string }) {
  const inner = (
    <>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{label}</div>
        <div className="text-sm font-semibold text-slate-900 truncate">{value}</div>
      </div>
    </>
  )
  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">{inner}</div>
}
