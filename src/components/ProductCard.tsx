'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { SmartImage } from './SmartImage'
import { trackEvent } from './GoogleAnalytics'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  businessName?: string
  businessColor?: string
  businessSlug?: string
  productSlug?: string
  index?: number
}

export function ProductCard({ product, businessName, businessColor = '#FF6B35', businessSlug, productSlug, index = 0 }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const fallbackSeed = productSlug || product.id || product.name.toLowerCase().replace(/\s+/g, '-')

  // Cerrar modal con tecla ESC
  useEffect(() => {
    if (!modalOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const openModal = useCallback(() => {
    setModalOpen(true)
    trackEvent('view_product', {
      product_id: product.id,
      product_name: product.name,
      business_slug: businessSlug,
      business_name: businessName,
      price: product.price,
    })
  }, [product.id, product.name, product.price, businessSlug, businessName])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
        className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-100 group cursor-pointer"
        onClick={openModal}
        title="Haz clic para ver más grande"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.image ? (
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              fallbackSeed={fallbackSeed}
              fallbackWidth={800}
              fallbackHeight={600}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `${businessColor}15` }}>
              🛍️
            </div>
          )}
          {product.tag && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
              style={{ background: businessColor }}
            >
              {product.tag}
            </span>
          )}
          {/* Icono de zoom al hacer hover */}
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5 text-slate-700" />
          </div>
        </div>
        <div className="p-3">
          <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
          {product.description && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-2 flex items-end justify-between gap-2">
            {product.price > 0 ? (
              <span className="font-extrabold text-base" style={{ color: businessColor }}>
                ${product.price.toFixed(2)}
              </span>
            ) : (
              <span className="font-bold text-xs text-slate-400 italic">
                Precio a consultar
              </span>
            )}
            {businessName && (
              <span className="text-[10px] text-slate-400 truncate">{businessName}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal/Lightbox */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-lg"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Imagen grande */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
                {product.image ? (
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    fallbackSeed={fallbackSeed}
                    fallbackWidth={1200}
                    fallbackHeight={900}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: `${businessColor}15` }}>
                    🛍️
                  </div>
                )}
                {product.tag && (
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ background: businessColor }}
                  >
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Info del producto */}
              <div className="p-6 overflow-y-auto">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                )}
                <div className="flex items-end justify-between gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Precio</div>
                    {product.price > 0 ? (
                      <div className="text-3xl font-extrabold" style={{ color: businessColor }}>
                        ${product.price.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-slate-400 italic">
                        Precio a consultar
                      </div>
                    )}
                  </div>
                  {businessName && (
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Negocio</div>
                      <div className="text-sm font-semibold text-slate-700">{businessName}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
