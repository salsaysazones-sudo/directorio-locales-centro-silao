#!/bin/bash
# Build estático para Cloudflare Workers Static Assets
# - Mueve temporalmente src/app/api a fuera (no compatibles con output: 'export')
# - Ejecuta next build con BUILD_STATIC=1
# - Restaura la carpeta api
# - Genera ./out/ listo para `wrangler deploy`

set -e

cd "$(dirname "$0")/.."

API_DIR="src/app/api"
BACKUP_DIR=".api-backup-tmp"

echo "🚀 Iniciando build estático para Cloudflare..."

# 1. Mover APIs temporalmente
if [ -d "$API_DIR" ]; then
  echo "📦 Moviendo APIs temporalmente..."
  mv "$API_DIR" "$BACKUP_DIR"
fi

# 2. Asegurar que public/data exista (necesario para el build)
if [ ! -d "public/data" ]; then
  echo "⚠️  No existe public/data/. Ejecuta primero: bun run scripts/export-data.ts"
  echo "   Generando datos demo automáticamente..."
  bun run scripts/export-data.ts
fi

# 3. Build estático
echo "🔨 Ejecutando next build (output: export)..."
BUILD_STATIC=1 bun run next build

# 4. Restaurar APIs
if [ -d "$BACKUP_DIR" ]; then
  echo "♻️  Restaurando APIs..."
  # Eliminar cualquier carpeta api creada por next
  rm -rf "$API_DIR" 2>/dev/null || true
  mv "$BACKUP_DIR" "$API_DIR"
fi

# 5. Verificar que out/ existe
if [ -d "out" ]; then
  echo ""
  echo "✅ Build estático completo!"
  echo "📂 Carpeta de salida: ./out/"
  echo ""
  echo "Siguientes pasos:"
  echo "  1. wrangler deploy    → desplegar a Cloudflare"
  echo "  2. wrangler dev       → probar localmente con runtime de Cloudflare"
  echo ""
else
  echo "❌ Error: no se generó la carpeta out/"
  exit 1
fi
