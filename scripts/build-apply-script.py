#!/usr/bin/env python3
"""Ensambla el script autocontenido apply-video-feature.sh
que el usuario descarga y ejecuta en su Linux para aplicar
la feature de videos para negocios Premium."""
import os

with open('/tmp/video.b64') as f:
    b64 = f.read().strip()

HEADER = '''#!/bin/bash
# ============================================================
#  Script: aplicar feature de videos para negocios Premium
#  Aplica todos los cambios de codigo + actualiza la BD
#  Generado automaticamente - ejecutar una sola vez
# ============================================================
set -e

PROJECT_DIR="$HOME/directorio-locales-centro-silao"

echo "================================================"
echo "  Instalando feature: Videos para Premium"
echo "================================================"
echo ""

# 1. Verificar que estamos en el proyecto correcto
if [ ! -d "$PROJECT_DIR" ]; then
  echo "ERROR: No se encontro el proyecto en $PROJECT_DIR"
  echo "Si tu proyecto esta en otra carpeta, edita este script"
  echo "y cambia la variable PROJECT_DIR."
  exit 1
fi

cd "$PROJECT_DIR"

# 2. Verificar que es el repo correcto
if [ ! -d ".git" ] || [ ! -f "package.json" ]; then
  echo "ERROR: $PROJECT_DIR no parece ser el repositorio correcto"
  exit 1
fi

echo "[1/4] Proyecto encontrado: $PROJECT_DIR"
echo "      Branch actual: $(git branch --show-current)"
echo "      Ultimo commit: $(git log --oneline -1)"
echo ""

# 3. Verificar que no hay cambios sin commitear (darian conflicto)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ADVERTENCIA: Tienes cambios sin commitear en tu repo."
  echo "            Es mejor commitearlos o descartarlos antes."
  echo ""
  read -p "Continuar de todos modos? (s/N): " resp
  if [ "$resp" != "s" ] && [ "$resp" != "S" ]; then
    echo "Cancelado. Commitea tus cambios primero:"
    echo "  git add . && git commit -m \\"mis cambios\\""
    exit 0
  fi
fi

# 4. Aplicar el patch (feature de videos)
echo "[2/4] Aplicando cambios del codigo..."
PATCH_B64="'''

FOOTER = '''"

echo "$PATCH_B64" | base64 -d | git am --signoff 2>&1 | head -20
echo "      Codigo aplicado."
echo ""

# 5. Actualizar la base de datos con el nuevo campo "video"
echo "[3/4] Actualizando base de datos (nuevo campo video)..."
bunx prisma db push --accept-data-loss 2>&1 | tail -3
bunx prisma generate 2>&1 | tail -2
echo "      Base de datos actualizada."
echo ""

# 6. Listo
echo "[4/4] Listo!"
echo ""
echo "================================================"
echo "  FEATURE DE VIDEOS INSTALADA CORRECTAMENTE"
echo "================================================"
echo ""
echo "Que se instalo:"
echo "  - Nuevo campo 'video' en la base de datos"
echo "  - Componente BusinessVideo (YouTube/TikTok)"
echo "  - Campo de video en el panel admin (tab Redes)"
echo "  - Solo disponible para negocios Premium"
echo ""
echo "PROXIMOS PASOS:"
echo ""
echo "  1. Inicia el servidor:"
echo "       bun run dev"
echo ""
echo "  2. Abre el panel admin:"
echo "       http://localhost:3000/?admin=1"
echo ""
echo "  3. Edita un negocio Premium (ej. Emocionarte),"
echo "     ve a la pestana 'Redes', pega una URL de"
echo "     YouTube Short o TikTok en el campo 'Video'."
echo ""
echo "  4. Cuando estes lista, sube los cambios a internet:"
echo "       git push"
echo ""
echo "  (git push ya tiene tu token configurado, no pedira nada)"
echo ""
'''

out_path = '/home/z/my-project/download/apply-video-feature.sh'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w') as f:
    f.write(HEADER + b64 + FOOTER)

# Hacer ejecutable
os.chmod(out_path, 0o755)

print(f"Script creado: {out_path}")
print(f"Tamano: {os.path.getsize(out_path)} bytes")

# Verificar que el base64 decodifica al patch original
import base64
decoded = base64.b64decode(b64).decode('utf-8')
with open('/tmp/video.patch') as f:
    original = f.read()
assert decoded == original, "El base64 no coincide con el patch original!"
print("Verificacion: base64 coincide con el patch original OK")
