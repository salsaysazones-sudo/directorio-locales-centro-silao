import { ADMIN_TOKEN_DEFAULT } from './types'
import type { Business, Category, Product } from './types'

// Enfoque híbrido:
// - Lectura: siempre desde JSON estático en /data/ (funciona en dev y producción)
// - Escritura: APIs de admin (solo disponibles en dev / serverless con backend)

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    ...opts,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error de red')
  return data as T
}

// Caché en memoria para evitar refetch en navegación cliente
let cache: {
  businesses?: Business[]
  categories?: Category[]
  stats?: { businesses: number; categories: number; products: number }
  businessDetail: Record<string, Business & { products: Product[] }>
  recommendations: Record<string, Business[]>
} = { businessDetail: {}, recommendations: {} }

export const api = {
  // ===== Lectura desde JSON estático =====
  async listBusinesses(params: { q?: string; category?: string; featured?: boolean } = {}): Promise<{ businesses: Business[] }> {
    if (!cache.businesses) {
      const data = await apiFetch<{ businesses: Business[] }>('/data/businesses.json')
      cache.businesses = data.businesses
    }
    let result = cache.businesses

    // Filtros en cliente (los datos vienen completos del JSON)
    if (params.featured) {
      result = result.filter((b) => b.featured)
    }
    if (params.category) {
      result = result.filter((b) => b.categoryId === params.category)
    }
    if (params.q) {
      const q = params.q.toLowerCase()
      result = result.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.city || '').toLowerCase().includes(q)
      )
    }
    return { businesses: [...result] }
  },

  async getBusiness(slug: string): Promise<{ business: Business & { products: Product[] } }> {
    if (!cache.businessDetail[slug]) {
      const data = await apiFetch<{ business: Business & { products: Product[] } }>(`/data/businesses/${slug}.json`)
      cache.businessDetail[slug] = data.business
    }
    return { business: cache.businessDetail[slug] }
  },

  async listCategories(): Promise<{ categories: Category[] }> {
    if (!cache.categories) {
      const data = await apiFetch<{ categories: Category[] }>('/data/categories.json')
      cache.categories = data.categories
    }
    return { categories: cache.categories }
  },

  async getRecommendations(slug: string, _limit = 4): Promise<{ recommendations: Business[] }> {
    if (!cache.recommendations[slug]) {
      try {
        const data = await apiFetch<{ recommendations: Business[] }>(`/data/recommendations/${slug}.json`)
        cache.recommendations[slug] = data.recommendations
      } catch {
        // Si no hay archivo, devolver array vacío
        cache.recommendations[slug] = []
      }
    }
    return { recommendations: cache.recommendations[slug] }
  },

  async getStats(): Promise<{ businesses: number; categories: number; products: number }> {
    if (!cache.stats) {
      try {
        cache.stats = await apiFetch('/data/stats.json')
      } catch {
        cache.stats = { businesses: 0, categories: 0, products: 0 }
      }
    }
    return cache.stats
  },

  // Invalida caché (útil tras editar en admin)
  invalidateCache() {
    cache = { businessDetail: {}, recommendations: {} }
  },

  // ===== Escritura vía APIs (solo dev) =====
  adminListBusinesses: (token: string) =>
    apiFetch<{ businesses: Business[] }>(`/api/admin/businesses`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminCreateBusiness: (token: string, data: Partial<Business> & { products?: Partial<Product>[] }) =>
    apiFetch<{ business: Business }>(`/api/admin/businesses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminUpdateBusiness: (token: string, id: string, data: Partial<Business>) =>
    apiFetch<{ business: Business }>(`/api/admin/businesses/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminDeleteBusiness: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/admin/businesses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminCreateProduct: (token: string, data: Partial<Product>) =>
    apiFetch<{ product: Product }>(`/api/admin/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminUpdateProduct: (token: string, id: string, data: Partial<Product>) =>
    apiFetch<{ product: Product }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminDeleteProduct: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminReseed: (token: string) =>
    apiFetch<{ ok: boolean; message?: string }>(`/api/seed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Generar JSON estático desde admin (dev) - llama al script de exportación
  async generateStaticData(token: string): Promise<{ ok: boolean; message: string }> {
    const res = await fetch('/api/export-data', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al generar datos')
    // Invalida caché para que los próximos reads traigan datos frescos
    cache = { businessDetail: {}, recommendations: {} }
    return data
  },
}

export { ADMIN_TOKEN_DEFAULT }
