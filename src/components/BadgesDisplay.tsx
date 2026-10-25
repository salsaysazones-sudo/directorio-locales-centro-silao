'use client'
import { BADGES, type BadgeId } from '@/lib/badges'

interface BadgesDisplayProps {
  badges: BadgeId[]
  variant?: 'card' | 'detail' | 'inline'
}

/**
 * Muestra los badges de un negocio.
 * - variant='card': para las cards del grid (compacto)
 * - variant='detail': para la página de detalle del negocio (más grande)
 * - variant='inline': en una sola línea
 */
export function BadgesDisplay({ badges, variant = 'card' }: BadgesDisplayProps) {
  if (!badges || badges.length === 0) return null

  const activeBadges = badges
    .map((id) => BADGES.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => b !== undefined)

  if (activeBadges.length === 0) return null

  if (variant === 'detail') {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {activeBadges.map((badge) => (
          <span
            key={badge.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
            style={{
              background: `${badge.color}15`,
              color: badge.color,
              borderColor: `${badge.color}30`,
            }}
            title={badge.description}
          >
            <span className="text-sm">{badge.icon}</span>
            {badge.label}
          </span>
        ))}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {activeBadges.map((badge) => (
          <span
            key={badge.id}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
            style={{
              background: `${badge.color}15`,
              color: badge.color,
            }}
            title={badge.description}
          >
            <span>{badge.icon}</span>
            {badge.label}
          </span>
        ))}
      </div>
    )
  }

  // variant='card' (default)
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {activeBadges.map((badge) => (
        <span
          key={badge.id}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
          style={{
            background: `${badge.color}15`,
            color: badge.color,
          }}
          title={badge.description}
        >
          <span>{badge.icon}</span>
          {badge.label}
        </span>
      ))}
    </div>
  )
}
