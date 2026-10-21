'use client'
import { MapPin, Star, ArrowUpRight } from 'lucide-react'
import type { Business } from '@/lib/types'
import { motion } from 'framer-motion'
import { SmartImage } from './SmartImage'

interface BusinessCardProps {
  business: Business
  onClick: () => void
  index?: number
}

export function BusinessCard({ business, onClick, index = 0 }: BusinessCardProps) {
  const category = business.category
  const color = category?.color || '#FF6B35'

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className={`group text-left bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border ${
        business.plan === 'premium' ? 'border-pink-200 ring-2 ring-pink-100' : 'border-slate-100'
      } relative`}
    >
      {/* Cover */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}40, ${color}10)` }} />
        {business.cover ? (
          <SmartImage
            src={business.cover}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallbackSeed={`${business.slug}-cover`}
            fallbackWidth={1200}
            fallbackHeight={600}
          />
        ) : null}
        {business.plan === 'premium' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white gradient-brand shadow-sm z-10">
            ✦ Premium
          </span>
        )}
        {business.featured && business.plan !== 'premium' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm" style={{ background: color }}>
            ⭐ Destacado
          </span>
        )}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-md">
          {business._count?.products || 0} productos
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div
            className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm -mt-8 bg-white"
            style={{ boxShadow: `0 0 0 2px ${color}30` }}
          >
            {business.logo ? (
              <SmartImage
                src={business.logo}
                alt={business.name}
                className="w-full h-full object-cover"
                fallbackSeed={`${business.slug}-logo`}
                fallbackWidth={200}
                fallbackHeight={200}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: `${color}20` }}>
                {business.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base leading-tight truncate group-hover:text-pink-600 transition-colors">
                {business.name}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors shrink-0 mt-0.5" />
            </div>
            {category && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1" style={{ color }}>
                <span>{category.icon}</span>
                {category.name}
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {business.description}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {business.city && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3" />
              {business.city}
            </span>
          )}
          {business.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color }}>
              <Star className="w-3 h-3 fill-current" />
              Top
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
