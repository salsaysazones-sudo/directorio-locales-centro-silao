// Definición de todos los badges disponibles para los negocios
// Para agregar uno nuevo, solo añádelo a este array

export type BadgeId =
  | 'solo-finde'
  | 'solo-whatsapp'
  | 'desde-casa'
  | 'por-encargo'
  | 'entrega-domicilio'
  | 'acepta-tarjeta'

export type Badge = {
  id: BadgeId
  label: string
  icon: string
  color: string
  description: string
}

export const BADGES: Badge[] = [
  {
    id: 'solo-finde',
    label: 'Solo findes',
    icon: '🗓️',
    color: '#F59E0B',
    description: 'Atiende solo viernes, sábado y domingo',
  },
  {
    id: 'solo-whatsapp',
    label: 'Solo WhatsApp',
    icon: '📱',
    color: '#25D366',
    description: 'Vende únicamente por encargo vía WhatsApp',
  },
  {
    id: 'desde-casa',
    label: 'Desde casa',
    icon: '🏠',
    color: '#8B5CF6',
    description: 'Negocio operando desde un espacio en casa',
  },
  {
    id: 'por-encargo',
    label: 'Por encargo',
    icon: '🛍️',
    color: '#EC4899',
    description: 'Requiere encargo previo (no venta al mostrador)',
  },
  {
    id: 'entrega-domicilio',
    label: 'Entrega a domicilio',
    icon: '🛵',
    color: '#06B6D4',
    description: 'Ofrece servicio de entrega a domicilio',
  },
  {
    id: 'acepta-tarjeta',
    label: 'Acepta tarjeta',
    icon: '💳',
    color: '#10B981',
    description: 'Acepta pagos con tarjeta de crédito/débito',
  },
]

// Función para parsear badges desde string de DB
export function parseBadges(badgesString: string | null | undefined): BadgeId[] {
  if (!badgesString) return []
  return badgesString.split(',').filter((b): b is BadgeId => b.length > 0) as BadgeId[]
}

// Función para convertir array de badges a string para DB
export function badgesToString(badges: BadgeId[]): string {
  return badges.join(',')
}

// Función para obtener los datos completos de un badge
export function getBadge(id: BadgeId): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}

// Función para obtener múltiples badges
export function getBadges(ids: BadgeId[]): Badge[] {
  return ids.map(getBadge).filter((b): b is Badge => b !== undefined)
}
