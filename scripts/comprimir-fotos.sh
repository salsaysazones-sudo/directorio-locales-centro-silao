#!/bin/bash
# Script para comprimir fotos de negocios - Directorio Silao
# Uso: comprimir-fotos.sh [carpeta] [opción]
# Opciones:
#   (sin opción)  : crea archivos _optimizada.jpg (NO toca originales)
#   --reemplazar  : sobreescribe las originales
#   --preview     : solo muestra tamaños, no comprime

CARPETA="${1:-.}"
MODO="${2:---comprimir}"
MAX_SIZE="1200x1200"
QUALITY=80

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "========================================="
echo "  COMPRESOR DE FOTOS - DIRECTORIO SILAO"
echo "========================================="
echo "Carpeta: $CARPETA"
case "$MODO" in
  --preview)    echo "Modo: PREVIEW (solo ver tamaños)" ;;
  --reemplazar) echo "Modo: REEMPLAZAR (sobreescribe originales)" ;;
  *)            echo "Modo: COMPRIMIR (crea versiones _optimizada)" ;;
esac
echo "Máximo: $MAX_SIZE px | Calidad: $QUALITY"
echo "========================================="
echo ""

# Verificar que ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick no está instalado${NC}"
    echo "Instala con: sudo apt install imagemagick"
    exit 1
fi

# Verificar que la carpeta existe
if [ ! -d "$CARPETA" ]; then
    echo -e "${RED}Error: La carpeta '$CARPETA' no existe${NC}"
    exit 1
fi

# Encontrar imágenes
IMAGES=$(find "$CARPETA" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) 2>/dev/null | sort)
COUNT=$(echo "$IMAGES" | grep -c . 2>/dev/null)

if [ "$COUNT" -eq 0 ]; then
    echo -e "${YELLOW}No se encontraron imágenes (.jpg/.jpeg/.png) en '$CARPETA'${NC}"
    exit 0
fi

echo "Encontradas: $COUNT imágenes"
echo ""

# Función para formatear tamaño
format_size() {
    local kb=$1
    if [ "$kb" -ge 1024 ]; then
        local mb=$(awk "BEGIN {printf \"%.1f\", $kb/1024}")
        echo "${mb} MB"
    else
        echo "${kb} KB"
    fi
}

# === MODO PREVIEW ===
if [ "$MODO" = "--preview" ]; then
    echo -e "${YELLOW}MODO PREVIEW - No se comprimirá nada${NC}"
    echo ""
    printf "%-45s %12s\n" "Archivo" "Tamaño"
    printf "%-45s %12s\n" "--------" "-------"
    total_size=0
    while IFS= read -r img; do
        if [ -n "$img" ]; then
            size=$(stat -c%s "$img" 2>/dev/null || echo 0)
            size_kb=$((size / 1024))
            total_size=$((total_size + size_kb))
            printf "%-45s %12s\n" "$(basename "$img")" "$(format_size $size_kb)"
        fi
    done <<< "$IMAGES"
    echo ""
    echo "Total: $(format_size $total_size)"
    echo ""
    echo "Para comprimir creando versiones nuevas:"
    echo "  comprimir-fotos.sh \"$CARPETA\""
    echo ""
    echo "Para comprimir y reemplazar originales:"
    echo "  comprimir-fotos.sh \"$CARPETA\" --reemplazar"
    exit 0
fi

# === MODOS DE COMPRESIÓN ===
total_antes=0
total_despues=0
procesadas=0

while IFS= read -r img; do
    if [ -n "$img" ]; then
        nombre_base=$(basename "$img")
        extension="${nombre_base##*.}"
        extension_min=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
        nombre_sin_ext="${nombre_base%.*}"

        size_antes=$(stat -c%s "$img" 2>/dev/null || echo 0)
        size_antes_kb=$((size_antes / 1024))
        total_antes=$((total_antes + size_antes_kb))

        if [ "$MODO" = "--reemplazar" ]; then
            # Reemplazar original
            temp_file="/tmp/compress_temp_${nombre_base}"
            convert "$img" -resize "${MAX_SIZE}>" -quality $QUALITY "$temp_file" 2>/dev/null

            if [ -f "$temp_file" ]; then
                mv "$temp_file" "$img"
                size_despues=$(stat -c%s "$img" 2>/dev/null || echo 0)
                size_despues_kb=$((size_despues / 1024))
                total_despues=$((total_despues + size_despues_kb))

                if [ "$size_antes_kb" -gt 0 ]; then
                    porcentaje=$((100 - (size_despues_kb * 100 / size_antes_kb)))
                else
                    porcentaje=0
                fi
                printf "%-45s %10s → %10s  ${GREEN}-%d%%${NC}\n" "$nombre_base" "$(format_size $size_antes_kb)" "$(format_size $size_despues_kb)" "$porcentaje"
                procesadas=$((procesadas + 1))
            else
                echo -e "${RED}Error al comprimir: $nombre_base${NC}"
            fi
        else
            # Crear versión nueva (_optimizada)
            nuevo_archivo="${img%.*}_optimizada.${extension_min}"
            convert "$img" -resize "${MAX_SIZE}>" -quality $QUALITY "$nuevo_archivo" 2>/dev/null

            if [ -f "$nuevo_archivo" ]; then
                size_despues=$(stat -c%s "$nuevo_archivo" 2>/dev/null || echo 0)
                size_despues_kb=$((size_despues / 1024))
                total_despues=$((total_despues + size_despues_kb))

                if [ "$size_antes_kb" -gt 0 ]; then
                    porcentaje=$((100 - (size_despues_kb * 100 / size_antes_kb)))
                else
                    porcentaje=0
                fi
                printf "%-45s %10s → %10s  ${GREEN}-%d%%${NC}\n" "$nombre_base" "$(format_size $size_antes_kb)" "$(format_size $size_despues_kb)" "$porcentaje"
                procesadas=$((procesadas + 1))
            else
                echo -e "${RED}Error al comprimir: $nombre_base${NC}"
            fi
        fi
    fi
done <<< "$IMAGES"

echo ""
echo "========================================="
echo "  RESUMEN"
echo "========================================="
echo "Procesadas: $procesadas imágenes"
echo "Tamaño antes:  $(format_size $total_antes)"
echo "Tamaño después: $(format_size $total_despues)"
if [ "$total_antes" -gt 0 ]; then
    reduccion=$((100 - (total_despues * 100 / total_antes)))
    echo -e "Reducción total: ${GREEN}-${reduccion}%${NC}"
fi
echo "========================================="
echo ""
if [ "$MODO" != "--reemplazar" ]; then
    echo -e "${CYAN}Archivos _optimizada.jpg creados. Originales intactos.${NC}"
    echo "Revisa las versiones nuevas y si todo está bien, puedes:"
    echo "  1. Renombrarlas para reemplazar las originales, o"
    echo "  2. Volver a ejecutar con --reemplazar"
else
    echo -e "${CYAN}Originales comprimidas directamente.${NC}"
fi
echo ""
