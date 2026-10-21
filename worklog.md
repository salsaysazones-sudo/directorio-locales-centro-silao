# Worklog - Directorio Digital

Proyecto: Directorio digital de negocios con URLs individuales por subpath.
Stack: Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Prisma (SQLite) + Zustand.

Decisiones clave:
- Routing todo dentro de `src/app/page.tsx` usando query params (?b=slug, ?admin=1) para respetar la restricción de solo ruta `/`.
- Estilo: colorido y enérgico tipo Rappi/Uber Eats.
- Admin único (panel central).
- 20 negocios demo en 5 rubros.
- Funciones: WhatsApp directo, buscador, recomendados.


---
Task ID: 1
Agent: main (Z.ai)
Task: Construir directorio digital completo con URLs individuales por negocio, panel admin único, 20 negocios demo, estilo colorido tipo Rappi.

Work Log:
- Definí schema Prisma (Category, Business, Product) y sincronicé DB con db:push
- Creé seed script con 20 negocios en 5 rubros (restaurantes, belleza, tiendas, servicios, salud) y 100 productos
- Implementé APIs públicos: /api/businesses, /api/businesses/[slug], /api/categories, /api/recommendations, /api/stats
- Implementé APIs admin con token Bearer: /api/admin/businesses (GET/POST), /api/admin/businesses/[id] (GET/PUT/DELETE), /api/admin/products (POST), /api/admin/products/[id] (PUT/DELETE), /api/seed (POST)
- Actualicé layout.tsx con fuente Plus Jakarta Sans, metadata en español, lang="es"
- Añadí estilos personalizados: gradient-brand, gradient-text, shadow-glow, scrollbar-hide en globals.css
- Construí componentes: Header (sticky, buscador, mobile menu), Footer (con stats), BusinessCard, ProductCard, CategoryFilter, WhatsAppButton (flotante)
- Construí DirectoryHome: hero con gradientes animados, stats, destacados, categorías con conteos, grid completo, CTA banner
- Construí BusinessDetail: cover, logo flotante, info grid, redes sociales, catálogo, recomendaciones, WhatsApp flotante, compartir
- Construí AdminPanel: login con token, dashboard con stats y tabla, formulario negocio con tabs (Básico/Contacto/Redes), gestor de productos CRUD, confirmar eliminar, restaurar demo
- Integré todo en page.tsx con routing por query params: / (home), /?b=slug (detalle), /?admin=1 (admin)
- Pasé bun run lint sin errores ni warnings
- Verifiqué con Agent Browser: home carga 20 negocios, detalle navega a /?b=slug, admin login funciona, dashboard muestra tabla completa, formulario de crear negocio con tabs se abre correctamente. Sin errores en runtime.

Stage Summary:
- Directorio funcional completo, 100% navegable desde /
- 20 negocios demo en 5 categorías con 100 productos
- URLs individuales compartibles: /?b=slug (cada negocio puede compartir en Facebook/TikTok/WhatsApp)
- Panel admin con token simple (admin-directorio-2026), CRUD completo de negocios y productos
- Botón "Restaurar demo" para resetear a 20 negocios
- Estilo colorido y enérgico (gradientes naranja-rosa-violeta tipo Rappi/Uber Eats)
- Recomendaciones automáticas (misma categoría + relleno con destacados)
- Botón WhatsApp flotante con mensaje pre-escrito por negocio
- Responsive (mobile + desktop), sticky footer, sin errores en runtime

---
Task ID: 2
Agent: main (Z.ai)
Task: Adaptar proyecto para deploy estático en Cloudflare + inicializar git para GitHub.

Work Log:
- Creé scripts/export-data.ts que lee SQLite y genera JSON en public/data/ (businesses, categories, stats, detalle por slug, recommendations)
- Adapté src/lib/api.ts: lecturas usan JSON estático (con caché en memoria), escrituras mantienen APIs (solo dev)
- Creé endpoint /api/export-data que ejecuta el script desde el admin (con token)
- Agregué botón "Generar deploy" (verde) en AdminPanel que llama a generateStaticData(token)
- Configuré next.config.ts con output:'export' condicional (BUILD_STATIC=1)
- Creé scripts/build-static.sh que mueve src/app/api temporalmente durante build estático
- Primera prueba: el flag `export const dynamic = process.env.BUILD_STATIC` no funcionó (Next.js requiere string estática)
- Solución: mover la carpeta api a .api-backup-tmp durante el build y restaurarla después
- Build estático exitoso: genera out/index.html + out/data/*.json + out/_next/ bundles
- Creé wrangler.toml para Cloudflare Workers Static Assets con not_found_handling="404-page"
- Creé .env.example documentando DATABASE_URL, ADMIN_TOKEN, NEXT_PUBLIC_ADMIN_TOKEN, BUILD_STATIC
- Actualicé .gitignore: ignora db/*.db, .env, .wrangler, .zscripts/, tests/, worklog.md
- Creé README.md con: arquitectura, setup, flujo edición+deploy, estructura proyecto, comandos, troubleshooting
- Actualicé package.json con scripts: seed, export-data, build:static, deploy, preview
- Verifiqué con Agent Browser: admin login + botón "Generar deploy" funciona, toast "Datos generados" aparece, POST /api/export-data responde 200
- Verifiqué build estático: out/ contiene index.html + data/businesses.json + data/businesses/*.json + data/categories.json + data/stats.json + data/recommendations/*.json
- Verifiqué con python http.server que todos los JSON sirven con 200 OK
- Configuré git user.email y user.name
- Hice commit: "feat: adaptar proyecto para deploy estático en Cloudflare + GitHub"

Stage Summary:
- Proyecto listo para deploy en Cloudflare Workers Static Assets (gratis)
- Sin remote configurado - el usuario debe crear repo en GitHub y agregar remote
- Botón "Generar deploy" en admin ejecuta export-data.ts automáticamente
- 20 negocios demo commiteados en public/data/ (deploy inmediato posible)
- README.md tiene instrucciones detalladas paso a paso
- Comandos disponibles: bun run dev (editar), bun run build:static (generar out/), bun run deploy (deploy directo)
