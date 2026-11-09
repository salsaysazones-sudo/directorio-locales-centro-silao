#!/bin/bash
# Cambia la paleta del directorio de Día de Muertos (pink/orange/purple) a Buen Fin (amber/slate/gold)
# Mapeo:
#   pink-50/100/600  -> amber-50/100/600  (dorado claro/medio)
#   orange-50/100    -> amber-50/100
#   purple-50/100    -> slate-50/100      (plateado)
#   hex FF6B35 (brand orange) -> B8860B (dark gold)
#   hex EC4899 (brand pink)   -> D4AF37 (gold)
#   hex EA580C (orange-600)   -> B8860B

set -e
cd /home/z/my-project

COMPONENTS=(
  src/components/AdminPanel.tsx
  src/components/DirectoryHome.tsx
  src/components/ProductCard.tsx
  src/components/PromotionKit.tsx
  src/components/BusinessCard.tsx
  src/components/Footer.tsx
  src/components/BusinessVideo.tsx
  src/components/BusinessDetail.tsx
  src/components/ViewStatsPanel.tsx
)

echo "=== Reemplazando colores en ${#COMPONENTS[@]} archivos ==="

for f in "${COMPONENTS[@]}"; do
  if [ ! -f "$f" ]; then
    echo "WARN: no existe $f, se omite"
    continue
  fi
  # Tailwind classes (word-boundary safe)
  sed -i \
    -e 's/\bpink-50\b/amber-50/g' \
    -e 's/\bpink-100\b/amber-100/g' \
    -e 's/\bpink-600\b/amber-600/g' \
    -e 's/\bpink-500\b/amber-500/g' \
    -e 's/\borange-50\b/amber-50/g' \
    -e 's/\borange-100\b/amber-100/g' \
    -e 's/\bpurple-50\b/slate-50/g' \
    -e 's/\bpurple-100\b/slate-100/g' \
    -e 's/\bpurple-600\b/slate-600/g' \
    "$f"
  # Hex brand colors
  sed -i \
    -e 's/#FF6B35/#B8860B/gi' \
    -e 's/"FF6B35"/"B8860B"/g' \
    -e 's/FF6B35/B8860B/g' \
    -e 's/#EC4899/#D4AF37/gi' \
    -e 's/EC4899/D4AF37/g' \
    -e 's/#EA580C/#B8860B/gi' \
    -e 's/EA580C/B8860B/g' \
    -e 's/#FB923C/#D4AF37/gi' \
    -e 's/FB923C/D4AF37/g' \
    "$f"
  echo "  OK: $f"
done

echo ""
echo "=== Resumen de colores restantes (deberian ser 0 o muy pocos) ==="
grep -rno "pink-\|orange-\|purple-\|FF6B35\|EC4899\|EA580C\|FB923C" "${COMPONENTS[@]}" 2>/dev/null | head -20 || echo "Ninguno restante"
echo ""
echo "Listo."
