'use client'
import { useState } from 'react'
import { Download, QrCode, Loader2 } from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import type { Business } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface DownloadAllQrsProps {
  businesses: Business[]
  publicBaseUrl: string // ej: https://directorio-locales-centro-silao.pages.dev
  token: string
}

export function DownloadAllQrs({ businesses, publicBaseUrl, token }: DownloadAllQrsProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!publicBaseUrl) {
      toast({
        title: 'Configura tu URL pública',
        description: 'Ingresa la URL de tu sitio (ej: https://midirectorio.com) para que los QR apunten al lugar correcto.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const zip = new JSZip()
      const qrFolder = zip.folder('qr-negocios')

      // Generar QR para cada negocio
      for (const b of businesses) {
        const url = `${publicBaseUrl.replace(/\/$/, '')}/?b=${b.slug}`
        const qrDataUrl = await QRCode.toDataURL(url, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 800,
          color: { dark: '#0f172a', light: '#ffffff' },
        })
        // Convertir dataURL a base64 sin prefijo
        const base64 = qrDataUrl.split(',')[1]
        qrFolder?.file(`qr-${b.slug}.png`, base64, { base64: true })
      }

      // Generar índice README
      const indexLines = [
        '# Códigos QR de los negocios',
        '',
        `Generado: ${new Date().toLocaleString('es-ES')}`,
        `Total: ${businesses.length} negocios`,
        '',
        '## Lista de QRs',
        '',
        '| Archivo | Negocio | URL |',
        '|---------|---------|-----|',
        ...businesses.map((b) => `| qr-${b.slug}.png | ${b.name} | ${publicBaseUrl.replace(/\/$/, '')}/?b=${b.slug} |`),
        '',
        '## Cómo usar',
        '',
        '- Cada archivo PNG es un código QR de alta resolución (800x800)',
        '- Imprime el que corresponde a cada negocio',
        '- El QR apunta directamente a la página del negocio en el directorio',
        '',
      ]
      zip.file('LEEME.md', indexLines.join('\n'))

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qr-todos-los-negocios-${new Date().toISOString().split('T')[0]}.zip`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: '✅ ZIP descargado',
        description: `${businesses.length} códigos QR en un solo archivo ZIP.`,
      })
    } catch (e) {
      console.error(e)
      toast({ title: 'Error', description: 'No se pudo generar el ZIP.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading || businesses.length === 0}
      variant="outline"
      className="text-xs"
      title="Descarga un ZIP con el QR de cada negocio, listo para imprimir"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
      Descargar QRs (ZIP)
    </Button>
  )
}
