'use client'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const GA_ID = 'G-DS09ZRHWYJ'

type GtagFunction = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GtagFunction
    dataLayer?: unknown[]
  }
}

// Función para trackear eventos personalizados
export function trackEvent(action: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (!window.gtag) return
  try {
    window.gtag('event', action, params)
  } catch (e) {
    // ignore
  }
}

// Componente interno que usa useSearchParams (necesita Suspense)
function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return
    const search = searchParams.toString()
    const url = search ? `${pathname}?${search}` : pathname
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('config', GA_ID, {
          page_path: url,
        })
      } catch (e) {
        // ignore
      }
    }
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname + window.location.search,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  )
}
