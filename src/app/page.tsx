'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DirectoryHome } from '@/components/DirectoryHome'
import { BusinessDetail } from '@/components/BusinessDetail'
import { AdminPanel } from '@/components/AdminPanel'
import { api } from '@/lib/api'

function DirectoryApp() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [stats, setStats] = useState<{ businesses: number; categories: number } | undefined>(undefined)

  const businessSlug = searchParams.get('b')
  const isAdmin = searchParams.get('admin') === '1'

  // Cargar stats para el footer
  useEffect(() => {
    api.getStats()
      .then((s) => setStats({ businesses: s.businesses, categories: s.categories }))
      .catch(() => {})
  }, [])

  // Scroll to top on view change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [businessSlug, isAdmin])

  const goHome = useCallback(() => router.push('/'), [router])
  const goAdmin = useCallback(() => router.push('/?admin=1'), [router])
  const openBusiness = useCallback((slug: string) => router.push(`/?b=${encodeURIComponent(slug)}`), [router])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onSearch={(q) => setQuery(q)}
        onGoHome={goHome}
        onGoAdmin={goAdmin}
        initialQuery={query}
      />

      <main className="flex-1">
        {isAdmin ? (
          <AdminPanel onOpenBusiness={openBusiness} />
        ) : businessSlug ? (
          <BusinessDetail
            slug={businessSlug}
            onBack={goHome}
            onOpenBusiness={openBusiness}
          />
        ) : (
          <DirectoryHome
            onOpenBusiness={openBusiness}
            initialQuery={query}
            onSearchChange={setQuery}
          />
        )}
      </main>

      <Footer onGoHome={goHome} onGoAdmin={goAdmin} stats={stats} />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl gradient-brand animate-pulse" />
      </div>
    }>
      <DirectoryApp />
    </Suspense>
  )
}
