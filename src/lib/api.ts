import { ADMIN_TOKEN_DEFAULT } from './types'
import type { Business, Category, Product } from './types'

const API_BASE = ''

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    ...opts,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error de red')
  return data as T
}

export const api = {
  // Público
  listBusinesses: (params: { q?: string; category?: string; featured?: boolean } = {}) => {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.category) sp.set('category', params.category)
    if (params.featured) sp.set('featured', '1')
    return apiFetch<{ businesses: Business[] }>(`/api/businesses?${sp.toString()}`)
  },
  getBusiness: (slug: string) =>
    apiFetch<{ business: Business & { products: Product[] } }>(`/api/businesses/${slug}`),
  listCategories: () => apiFetch<{ categories: Category[] }>(`/api/categories`),
  getRecommendations: (slug: string, limit = 4) =>
    apiFetch<{ recommendations: Business[] }>(`/api/recommendations?slug=${slug}&limit=${limit}`),
  getStats: () => apiFetch<{ businesses: number; categories: number; products: number }>(`/api/stats`),

  // Admin
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
}

export { ADMIN_TOKEN_DEFAULT }
