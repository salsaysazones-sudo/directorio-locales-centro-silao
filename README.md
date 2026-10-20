# Directorio Locales Centro Silao · Directorio Digital

Directorio digital de negocios con URLs individuales por negocio. Cada negocio tiene su propia URL compartible (`/?b=slug`) que puede usarse en Facebook, TikTok y WhatsApp. El sitio se despliega como **estático en Cloudflare** (gratis, rápido, sin servidor que mantener) y los datos se editan desde el **panel admin en local**.

## Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Estilos**: Tailwind CSS 4 + shadcn/ui + Framer Motion
- **DB (solo dev)**: SQLite + Prisma ORM
- **Deploy**: Cloudflare Workers Static Assets (100% gratis)
- **Versionado**: Git + GitHub

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  DEV (tu computadora)                                   │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  Admin Panel │ ─→ │  APIs Next   │ ─→  SQLite       │
│  │  (editar)    │ ←─ │  (CRUD)      │ ←─  (db/custom.db)│
│  └──────────────┘    └──────────────┘                  │
│         │                                               │
│         │ (botón "Generar deploy")                      │
│         ▼                                               │
│  ┌────────────────────────────┐                         │
│  │  scripts/export-data.ts    │                         │
│  │  → genera JSON en /public/data/ │                    │
│  └────────────────────────────┘                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ git push
                         ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub repo                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  código fuente + public/data/*.json (commitado)  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ wrangler deploy (o CI)
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Workers Static Assets                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  out/index.html + out/data/*.json               │   │
│  │  Servido desde 300+ edge locations              │   │
│  │  URL: https://directorio-locales-centro-silao.<sub>.workers.dev │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Setup inicial (una sola vez)

### 1. Instalar dependencias

```bash
bun install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env y cambia ADMIN_TOKEN por uno seguro
```

### 3. Inicializar base de datos y cargar datos demo

```bash
bun run db:push
bun run scripts/seed.ts
bun run scripts/export-data.ts
```

### 4. Modo desarrollo

```bash
bun run dev
```

Abre `http://localhost:3000`. El admin está en `http://localhost:3000/?admin=1`.

Token demo: `admin-directorio-2026` (cámbialo en `.env`).

## Flujo de edición y deploy

Cuando quieras agregar, editar o eliminar negocios:

### Paso 1: Editar en dev

```bash
bun run dev
```

Abre `http://localhost:3000/?admin=1`, ingresa tu token y haz los cambios que necesites (crear, editar, eliminar negocios y productos).

### Paso 2: Generar datos para deploy

Desde el panel admin, haz clic en el botón verde **"Generar deploy"**. Esto ejecuta `scripts/export-data.ts` y actualiza los archivos JSON en `public/data/`.

> Alternativa desde terminal: `bun run scripts/export-data.ts`

### Paso 3: Commit y push a GitHub

```bash
git add .
git commit -m "Actualizo negocios: <descripción del cambio>"
git push origin main
```

### Paso 4: Deploy a Cloudflare

#### Opción A: Deploy automático desde GitHub (recomendado)

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Workers
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build command**: `BUILD_STATIC=1 bun run build`
   - **Deploy command**: `npx wrangler deploy`
   - **Root directory**: `/`
4. Cada `git push` a `main` hará deploy automático

#### Opción B: Deploy manual con Wrangler

```bash
# Instalar wrangler global (una sola vez)
npm install -g wrangler

# Login a Cloudflare
wrangler login

# Build estático
BUILD_STATIC=1 bun run build

# Deploy
wrangler deploy
```

Tu sitio estará en `https://directorio-locales-centro-silao.<tu-subdomain>.workers.dev` (o tu dominio custom).

## Estructura del proyecto

```
directorio-locales-centro-silao/
├── prisma/
│   └── schema.prisma           # Modelos: Category, Business, Product
├── db/
│   └── custom.db               # SQLite (NO se commitea, solo dev)
├── public/
│   └── data/                   # JSON estático (SÍ se commitea, va a producción)
│       ├── businesses.json
│       ├── categories.json
│       ├── stats.json
│       ├── businesses/<slug>.json
│       └── recommendations/<slug>.json
├── scripts/
│   ├── seed.ts                 # Carga 20 negocios demo
│   └── export-data.ts          # Exporta SQLite → JSON estático
├── src/
│   ├── app/
│   │   ├── page.tsx            # Router principal (?, ?b=slug, ?admin=1)
│   │   ├── layout.tsx
│   │   └── api/                # APIs (solo dev, no se deployan)
│   ├── components/             # UI components
│   └── lib/
│       ├── db.ts               # Prisma client
│       ├── api.ts              # Lee JSON / escribe APIs
│       ├── types.ts
│       └── admin-store.ts      # Zustand store
├── wrangler.toml               # Config Cloudflare Workers
├── next.config.ts              # output:'export' condicional
└── package.json
```

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo con APIs + SQLite |
| `bun run lint` | Verificar código con ESLint |
| `bun run db:push` | Sincronizar schema Prisma con SQLite |
| `bun run scripts/seed.ts` | Cargar 20 negocios demo (sobreescribe) |
| `bun run scripts/export-data.ts` | Exportar SQLite a JSON estático |
| `BUILD_STATIC=1 bun run build` | Generar build estático en `./out/` |
| `wrangler deploy` | Desplegar a Cloudflare |
| `wrangler dev` | Probar build estático localmente |

## ¿Cómo funcionan las URLs individuales?

Cada negocio tiene una URL única basada en su `slug`:

- `https://tu-dominio.com/?b=burger-town` → Página de Burger Town
- `https://tu-dominio.com/?b=la-cocina-de-dona-rosa` → Página de La Cocina de Doña Rosa

Cuando un negocio comparte su URL en Facebook/TikTok/WhatsApp:
1. El visitante llega directo a su catálogo
2. Ve el botón de WhatsApp, redes, dirección, etc.
3. Al final de la página hay recomendaciones de otros negocios del directorio

> **Tip SEO**: Si en el futuro quieres URLs tipo `/negocio/burger-town` (mejor para SEO), se puede agregar con `generateStaticParams`. Por ahora `/?b=slug` funciona perfectamente para compartir en redes.

## Personalización

### Cambiar el token de admin

Edita `.env`:
```
ADMIN_TOKEN=tu-token-super-seguro-aqui
NEXT_PUBLIC_ADMIN_TOKEN=tu-token-super-seguro-aqui
```

### Cambiar nombre del directorio

- `src/app/layout.tsx` (metadata)
- `src/components/Header.tsx` (logo)
- `src/components/Footer.tsx` (footer)
- `wrangler.toml` (campo `name`)

### Cambiar colores del tema

Edita las clases `gradient-brand` en `src/app/globals.css`:
```css
.gradient-brand {
  background-image: linear-gradient(135deg, #FF6B35 0%, #EC4899 50%, #8B5CF6 100%);
}
```

### Agregar categorías

Desde el panel admin no se pueden agregar categorías directamente. Para hacerlo:

```bash
# Editar scripts/seed.ts y agregar la categoría en el array
# Luego:
bun run scripts/seed.ts
bun run scripts/export-data.ts
```

## Costos

- **Cloudflare Workers Free tier**: 100,000 requests/día, 10 MiB Worker size
- **GitHub**: gratis para repositorios públicos y privados
- **Dominio**: opcional (~$10/año) o gratis con `*.workers.dev`

Total: **$0/mes** para un directorio de hasta miles de visitas diarias.

## Limitaciones del modo estático

- ❌ El panel admin **NO funciona en producción** (solo en dev). Para editar, usa tu computadora.
- ❌ No hay búsqueda server-side (la búsqueda es client-side sobre el JSON).
- ❌ No hay formularios de contacto dinámicos (los botones abren WhatsApp directamente).

Si en el futuro necesitas admin en producción o más funcionalidades dinámicas, puedes migrar a:
- Cloudflare Workers + D1 (SQLite distribuido)
- Vercel + Postgres
- Cualquier host con Node.js

## Troubleshooting

### El build estático falla con "useSearchParams"
Asegúrate de que `src/app/page.tsx` tenga `<Suspense>` envolviendo el componente que usa `useSearchParams`. Ya está configurado.

### Wrangler no encuentra `./out`
Ejecuta primero `BUILD_STATIC=1 bun run build` y verifica que la carpeta `out/` existe.

### Las imágenes no cargan en producción
Las imágenes demo usan `picsum.photos`. En producción pueden tardar. Para imágenes reales, sube tus fotos a Cloudflare Images o usa URLs directas a tus imágenes.

### Perdí el token de admin
Edita `.env` con un nuevo `ADMIN_TOKEN`, reinicia `bun run dev` y usa el nuevo token.

### Quiero resetear todo
```bash
rm db/custom.db
bun run db:push
bun run scripts/seed.ts
bun run scripts/export-data.ts
```

## Licencia

Proyecto de uso libre para tu directorio local.
