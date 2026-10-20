'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Plus, Edit3, Trash2, X, Store, Package, Search,
  ExternalLink, Star, RefreshCw, Lock, ShieldCheck, ChevronDown,
  Save, AlertCircle, LayoutGrid, Rocket, FileJson,
} from 'lucide-react'
import { api, ADMIN_TOKEN_DEFAULT } from '@/lib/api'
import type { Business, Category, Product } from '@/lib/types'
import { useAdminStore } from '@/lib/admin-store'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DownloadAllQrs } from './DownloadAllQrs'

interface AdminPanelProps {
  onOpenBusiness: (slug: string) => void
}

export function AdminPanel({ onOpenBusiness }: AdminPanelProps) {
  const { isAuthed, token, login, logout } = useAdminStore()
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')

  if (!isAuthed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card border border-slate-100 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-5 shadow-glow">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Panel de administración</h1>
          <p className="text-sm text-slate-500 mb-6">
            Ingresa tu token de acceso para gestionar los negocios del directorio.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (login(tokenInput)) {
                setError('')
              } else {
                setError('Token incorrecto. Verifica e intenta de nuevo.')
              }
            }}
            className="space-y-3"
          >
            <Input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Token de administrador"
              className="text-center font-mono"
            />
            {error && (
              <p className="text-xs text-red-500 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            <Button type="submit" className="w-full gradient-brand text-white font-bold" size="lg">
              <ShieldCheck className="w-4 h-4" />
              Ingresar
            </Button>
          </form>
          <div className="mt-6 p-3 bg-slate-50 rounded-xl text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              💡 Token demo
            </p>
            <code className="text-xs text-slate-700 font-mono break-all">{ADMIN_TOKEN_DEFAULT}</code>
          </div>
        </motion.div>
      </div>
    )
  }

  return <AdminDashboard token={token!} onLogout={logout} onOpenBusiness={onOpenBusiness} />
}

// ============ Dashboard ============
function AdminDashboard({
  token, onLogout, onOpenBusiness,
}: { token: string; onLogout: () => void; onOpenBusiness: (slug: string) => void }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Business | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Business | null>(null)
  const [managingProducts, setManagingProducts] = useState<Business | null>(null)
  const [confirmReseed, setConfirmReseed] = useState(false)
  const [reseedLoading, setReseedLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [publicBaseUrl, setPublicBaseUrl] = useState('')
  const { toast } = useToast()

  // Cargar URL pública guardada en localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('plaza-sv-public-url') : ''
    if (saved) setPublicBaseUrl(saved)
    else if (typeof window !== 'undefined') setPublicBaseUrl(window.location.origin)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [biz, cats] = await Promise.all([
        api.adminListBusinesses(token),
        api.listCategories(),
      ])
      setBusinesses(biz.businesses)
      setCategories(cats.categories)
    } catch (e) {
      console.error(e)
      toast({ title: 'Error al cargar', description: 'No se pudieron cargar los negocios.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [token, toast])

  useEffect(() => { load() }, [load])

  const filtered = businesses.filter((b) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return b.name.toLowerCase().includes(q) || b.slug.includes(q) || (b.city || '').toLowerCase().includes(q)
  })

  const stats = {
    total: businesses.length,
    featured: businesses.filter((b) => b.featured).length,
    active: businesses.filter((b) => b.active).length,
    products: businesses.reduce((acc, b) => acc + (b._count?.products || 0), 0),
  }

  const handleReseed = async () => {
    setReseedLoading(true)
    try {
      await api.adminReseed(token)
      toast({ title: '✅ Datos restaurados', description: 'Se han recargado los 20 negocios demo.' })
      await load()
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo restaurar los datos.', variant: 'destructive' })
    } finally {
      setReseedLoading(false)
      setConfirmReseed(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const result = await api.generateStaticData(token)
      toast({
        title: '✅ Datos generados',
        description: 'Los archivos JSON se actualizaron en public/data/. Ahora commitea y deploya.',
      })
      console.log(result.message)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      toast({ title: 'Error al generar', description: msg, variant: 'destructive' })
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-pink-600" />
            Panel de administración
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestiona los {businesses.length} negocios del directorio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setConfirmReseed(true)}
            disabled={reseedLoading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reseedLoading ? 'animate-spin' : ''}`} />
            Restaurar demo
          </Button>
          <Button
            onClick={handleExport}
            disabled={exportLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
            title="Genera los archivos JSON estáticos listos para deploy en Cloudflare"
          >
            {exportLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
            Generar deploy
          </Button>
          <Button onClick={() => setCreating(true)} className="gradient-brand text-white font-bold">
            <Plus className="w-4 h-4" />
            Nuevo negocio
          </Button>
          <Button variant="ghost" onClick={onLogout} size="icon" title="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<Store className="w-4 h-4" />} label="Total" value={stats.total} color="#FF6B35" />
        <StatCard icon={<Star className="w-4 h-4" />} label="Destacados" value={stats.featured} color="#EC4899" />
        <StatCard icon={<ShieldCheck className="w-4 h-4" />} label="Activos" value={stats.active} color="#10B981" />
        <StatCard icon={<Package className="w-4 h-4" />} label="Productos" value={stats.products} color="#8B5CF6" />
      </div>

      {/* Kit de promoción */}
      <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 rounded-2xl border border-pink-100">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
              URL pública del directorio (para QRs)
            </label>
            <input
              type="url"
              value={publicBaseUrl}
              onChange={(e) => {
                setPublicBaseUrl(e.target.value)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('plaza-sv-public-url', e.target.value)
                }
              }}
              placeholder="https://midirectorio.com"
              className="w-full px-3 py-2 bg-white rounded-lg text-sm font-mono border border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Usa la URL real de tu sitio deployado en Cloudflare para que los QRs apunten al lugar correcto.
            </p>
          </div>
          <DownloadAllQrs businesses={businesses} publicBaseUrl={publicBaseUrl} token={token} />
        </div>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, slug o ciudad..."
          className="pl-10"
        />
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider">Negocio</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Ciudad</th>
                <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider">Productos</th>
                <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Plan</th>
                <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">Estado</th>
                <th className="text-right px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No se encontraron negocios.</td></tr>
              ) : filtered.map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId)
                const color = cat?.color || '#FF6B35'
                return (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {b.logo && <img src={b.logo} alt={b.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate flex items-center gap-1">
                            {b.name}
                            {b.featured && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">/{b.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {cat && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: `${color}15`, color }}>
                          {cat.icon} {cat.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600 text-xs">{b.city || '—'}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">{b._count?.products || 0}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {b.plan === 'premium' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white gradient-brand">
                          ✦ Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                          Gratis
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${b.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${b.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {b.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenBusiness(b.slug)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                          title="Ver página pública"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setManagingProducts(b)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-purple-600"
                          title="Gestionar productos"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditing(b)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(b)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog editar/crear */}
      <BusinessFormDialog
        open={creating || editing !== null}
        business={editing}
        categories={categories}
        token={token}
        onClose={() => { setCreating(false); setEditing(null) }}
        onSaved={() => { setCreating(false); setEditing(null); load() }}
      />

      {/* Dialog gestionar productos */}
      <ProductsManagerDialog
        business={managingProducts}
        token={token}
        onClose={() => setManagingProducts(null)}
        onChanged={load}
      />

      {/* Confirmar eliminar */}
      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos los productos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return
                try {
                  await api.adminDeleteBusiness(token, deleting.id)
                  toast({ title: '✅ Negocio eliminado' })
                  setDeleting(null)
                  load()
                } catch (e) {
                  toast({ title: 'Error', description: 'No se pudo eliminar.', variant: 'destructive' })
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmar reseed */}
      <AlertDialog open={confirmReseed} onOpenChange={setConfirmReseed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar datos demo?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borrarán todos los negocios actuales y se recargarán los 20 negocios demo originales con sus productos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReseed} disabled={reseedLoading}>
              {reseedLoading ? 'Restaurando...' : 'Sí, restaurar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  )
}

// ============ Formulario negocio ============
function BusinessFormDialog({
  open, business, categories, token, onClose, onSaved,
}: {
  open: boolean
  business: Business | null
  categories: Category[]
  token: string
  onClose: () => void
  onSaved: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', logo: '', cover: '',
    phone: '', whatsapp: '', email: '', address: '', city: '', hours: '',
    facebook: '', instagram: '', tiktok: '', website: '',
    featured: false, active: true, plan: 'gratis' as 'gratis' | 'premium', categoryId: '',
  })

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name, slug: business.slug, description: business.description,
        logo: business.logo, cover: business.cover,
        phone: business.phone || '', whatsapp: business.whatsapp || '', email: business.email || '',
        address: business.address || '', city: business.city || '', hours: business.hours || '',
        facebook: business.facebook || '', instagram: business.instagram || '',
        tiktok: business.tiktok || '', website: business.website || '',
        featured: business.featured, active: business.active,
        plan: (business.plan as 'gratis' | 'premium') || 'gratis', categoryId: business.categoryId,
      })
    } else {
      setForm({
        name: '', slug: '', description: '', logo: '', cover: '',
        phone: '', whatsapp: '', email: '', address: '', city: '', hours: '',
        facebook: '', instagram: '', tiktok: '', website: '',
        featured: false, active: true, plan: 'gratis' as 'gratis' | 'premium',
        categoryId: categories[0]?.id || '',
      })
    }
  }, [business, categories, open])

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.categoryId) {
      toast({ title: 'Faltan campos', description: 'Nombre, slug y categoría son obligatorios.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      if (business) {
        await api.adminUpdateBusiness(token, business.id, form)
        toast({ title: '✅ Negocio actualizado' })
      } else {
        await api.adminCreateBusiness(token, form)
        toast({ title: '✅ Negocio creado' })
      }
      onSaved()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{business ? 'Editar negocio' : 'Nuevo negocio'}</DialogTitle>
          <DialogDescription>
            Completa la información. El slug será parte de la URL pública: /?b=slug
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="social">Redes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nombre *</Label>
                <Input value={form.name} onChange={(e) => {
                  setForm({ ...form, name: e.target.value, slug: business ? form.slug : slugify(e.target.value) })
                }} />
              </div>
              <div>
                <Label>Slug (URL) *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoría *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Logo (URL)</Label>
                <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Portada (URL)</Label>
              <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.plan === 'premium'} onCheckedChange={(v) => setForm({ ...form, plan: v ? 'premium' : 'gratis' })} />
                <span className="text-sm font-semibold">✦ Premium</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <span className="text-sm font-semibold">⭐ Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <span className="text-sm font-semibold">✅ Activo</span>
              </label>
            </div>
            {form.plan === 'premium' && (
              <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 text-xs text-slate-600">
                <strong className="text-pink-700">✦ Plan Premium activo:</strong> el negocio se mostrará con badge premium, borde destacado en grid y prioridad en orden.
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+503 2222-0000" />
              </div>
              <div>
                <Label>WhatsApp (sin + ni espacios)</Label>
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="50322220000" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ciudad</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label>Horario</Label>
                <Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Lun-Sáb 9:00 AM - 6:00 PM" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-3 mt-4">
            <div>
              <Label>Facebook URL</Label>
              <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <Label>TikTok URL</Label>
              <Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} placeholder="https://tiktok.com/@..." />
            </div>
            <div>
              <Label>Sitio web</Label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gradient-brand text-white font-bold">
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ Gestor de productos ============
function ProductsManagerDialog({
  business, token, onClose, onChanged,
}: {
  business: Business | null
  token: string
  onClose: () => void
  onChanged: () => void
}) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    if (!business) return
    setLoading(true)
    try {
      const data = await api.getBusiness(business.slug)
      setProducts(data.business.products)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [business])

  useEffect(() => {
    if (business) load()
  }, [business, load])

  if (!business) return null
  const cat = business.category

  return (
    <Dialog open={business !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Productos de {business.name}
          </DialogTitle>
          <DialogDescription>
            {products.length} productos en el catálogo. Agrega, edita o elimina.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-3">
          <Button onClick={() => setCreating(true)} size="sm" className="gradient-brand text-white">
            <Plus className="w-4 h-4" />
            Agregar producto
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No hay productos todavía.
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate flex items-center gap-2">
                    {p.name}
                    {p.tag && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: cat?.color || '#FF6B35' }}>{p.tag}</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{p.description}</div>
                </div>
                <div className="font-bold text-sm" style={{ color: cat?.color || '#FF6B35' }}>${p.price.toFixed(2)}</div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-white rounded text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api.adminDeleteProduct(token, p.id)
                        toast({ title: '✅ Producto eliminado' })
                        load(); onChanged()
                      } catch {
                        toast({ title: 'Error', variant: 'destructive' })
                      }
                    }}
                    className="p-1.5 hover:bg-white rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>

      <ProductFormDialog
        open={creating || editing !== null}
        product={editing}
        businessId={business.id}
        token={token}
        onClose={() => { setCreating(false); setEditing(null) }}
        onSaved={() => { setCreating(false); setEditing(null); load(); onChanged() }}
      />
    </Dialog>
  )
}

function ProductFormDialog({
  open, product, businessId, token, onClose, onSaved,
}: {
  open: boolean
  product: Product | null
  businessId: string
  token: string
  onClose: () => void
  onSaved: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', tag: '' })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        image: product.image,
        tag: product.tag || '',
      })
    } else {
      setForm({ name: '', description: '', price: '', image: '', tag: '' })
    }
  }, [product, open])

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      toast({ title: 'Faltan campos', description: 'Nombre y precio son obligatorios.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      if (product) {
        await api.adminUpdateProduct(token, product.id, { ...form, price: parseFloat(form.price) })
        toast({ title: '✅ Producto actualizado' })
      } else {
        await api.adminCreateProduct(token, { ...form, price: parseFloat(form.price), businessId })
        toast({ title: '✅ Producto creado' })
      }
      onSaved()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nombre *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Precio *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label>Etiqueta</Label>
              <Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Top, Nuevo..." />
            </div>
          </div>
          <div>
            <Label>Imagen (URL)</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gradient-brand text-white font-bold">
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
