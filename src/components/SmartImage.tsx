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

// Extensiones soportadas para imágenes locales (en orden de preferencia)
const LOCAL_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/**
 * Imagen inteligente que:
 * - Si el src empieza con /images/businesses/ (ruta local sin extensión),
 *   prueba múltiples extensiones (.jpg, .jpeg, .png, .webp) hasta encontrar una que exista
 * - Si ninguna extensión existe, usa picsum.photos como fallback temporal
 * - Para URLs completas (picsum, etc.), las usa directamente con fallback a picsum
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
  // Detectar si es una imagen local sin extensión
  const isLocalWithoutExt = src.startsWith('/images/businesses/') && !/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(src)

  // Estado: cuántas extensiones hemos probado
  // 0 = primera extensión (.jpg)
  // 1 = segunda (.jpeg)
  // 2 = tercera (.png)
  // 3 = cuarta (.webp)
  // 4 = todas fallaron, usar picsum
  // 5 = picsum también falló, mostrar placeholder
  const [attempt, setAttempt] = useState(0)

  // Calcular el src actual según el intento
  let currentSrc: string
  if (isLocalWithoutExt) {
    if (attempt < LOCAL_EXTENSIONS.length) {
      // Probar extensión actual
      currentSrc = src + LOCAL_EXTENSIONS[attempt]
    } else if (attempt === LOCAL_EXTENSIONS.length && fallbackSeed) {
      // Todas las extensiones fallaron, usar picsum
      currentSrc = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/${fallbackWidth}/${fallbackHeight}`
    } else {
      // Picsum también falló (sin internet?) - mostrar placeholder gris
      currentSrc = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${fallbackWidth}" height="${fallbackHeight}"><rect width="100%" height="100%" fill="#f1f5f9"/></svg>`)}`
    }
  } else {
    // URL completa (picsum o URL externa)
    if (attempt === 0) {
      currentSrc = src
    } else if (attempt === 1 && fallbackSeed) {
      currentSrc = `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/${fallbackWidth}/${fallbackHeight}`
    } else {
      currentSrc = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${fallbackWidth}" height="${fallbackHeight}"><rect width="100%" height="100%" fill="#f1f5f9"/></svg>`)}`
    }
  }

  const handleError = useCallback(() => {
    setAttempt((prev) => prev + 1)
  }, [])

  return (
    <img
      key={src}
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  )
}
