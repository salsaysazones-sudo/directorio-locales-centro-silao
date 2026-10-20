// Tipos compartidos del directorio
export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  _count?: { businesses: number }
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image: string
  tag: string | null
  businessId: string
}

export type Business = {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  cover: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  city: string | null
  hours: string | null
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  website: string | null
  featured: boolean
  active: boolean
  plan: 'gratis' | 'premium'
  categoryId: string
  category?: Category
  products?: Product[]
  _count?: { products: number }
}

export const ADMIN_TOKEN_DEFAULT = 'admin-directorio-2026'
