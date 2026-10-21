'use client'
import type { Product } from '@/lib/types'
import { motion } from 'framer-motion'
import { SmartImage } from './SmartImage'

interface ProductCardProps {
  product: Product
  businessName?: string
  businessColor?: string
  businessSlug?: string
  productSlug?: string // nombre del archivo sin extensión (ej: 'papa-costilla')
  index?: number
}

export function ProductCard({ product, businessName, businessColor = '#FF6B35', businessSlug, productSlug, index = 0 }: ProductCardProps) {
  // Genera seed para fallback de picsum
  const fallbackSeed = productSlug || product.id || product.name.toLowerCase().replace(/\s+/g, '-')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-100 group"
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
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
        {product.description && (
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="font-extrabold text-base" style={{ color: businessColor }}>
            ${product.price.toFixed(2)}
          </span>
          {businessName && (
            <span className="text-[10px] text-slate-400 truncate">{businessName}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
