'use client'
import { useState, useCallback } from 'react'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fallbackSeed?: string // seed para generar fallback de picsum si la imagen local no carga
  fallbackWidth?: number
  fallbackHeight?: number
}

/**
 * Imagen inteligente que:
 * - Intenta cargar la foto local (/images/businesses/...)
 * - Si falla (404), usa picsum.photos como fallback temporal
 * - Útil para cuando subimos estructura de carpetas pero todavía no hay fotos reales
 */
export function SmartImage({
  src,
  alt,
  className,
  loading = 'lazy',
  fallbackSeed,
  fallbackWidth = 800,
  fallbackHeight = 600,
}: SmartImageProps) {
  const [errorCount, setErrorCount] = useState(0)

  // Si la imagen original falla y tenemos fallbackSeed, usar picsum
  const currentSrc = errorCount > 0 && fallbackSeed
    ? `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/${fallbackWidth}/${fallbackHeight}`
    : src

  const handleError = useCallback(() => {
    if (errorCount === 0) {
      setErrorCount(1)
    }
  }, [errorCount])

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  )
}
