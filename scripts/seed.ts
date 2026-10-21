// Seed script - 20 negocios demo + categorías + productos
import { db } from '../src/lib/db'

const categories = [
  { name: 'Restaurantes', slug: 'restaurantes', icon: '🍽️', color: '#FF6B35' },
  { name: 'Belleza y Cuidado', slug: 'belleza', icon: '💄', color: '#EC4899' },
  { name: 'Tiendas y Moda', slug: 'tiendas', icon: '🛍️', color: '#8B5CF6' },
  { name: 'Servicios', slug: 'servicios', icon: '🔧', color: '#06B6D4' },
  { name: 'Salud y Bienestar', slug: 'salud', icon: '🌿', color: '#10B981' },
]

type BusinessSeed = {
  name: string
  slug: string
  description: string
  logo: string
  cover: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  city?: string
  hours?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  website?: string
  featured?: boolean
  hidden?: boolean // true = oculto del directorio público
  plan?: 'gratis' | 'premium'
  categorySlug: string
  products: { name: string; description?: string; price: number; image: string; tag?: string }[]
}

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

// Foto local sin extensión - SmartImage prueba .jpg, .jpeg, .png, .webp automáticamente
// Uso: localImg('da-bbq-pit', 'logo') → /images/businesses/da-bbq-pit/logo
// El componente SmartImage prueba logo.jpg, logo.jpeg, logo.png, logo.webp en orden
const localImg = (slug: string, filename: string) =>
  `/images/businesses/${slug}/${filename}`

const businesses: BusinessSeed[] = [
  // ===== RESTAURANTES (5) =====
  {
    name: 'La Cocina de Doña Rosa',
    slug: 'la-cocina-de-dona-rosa',
    description: 'Auténtica comida casera latinoamericana. Especialidad en tamales, enchiladas y postres tradicionales. Recetas de la abuela pasadas de generación en generación.',
    logo: img('dona-rosa-logo', 200, 200),
    cover: img('dona-rosa-cover', 1200, 600),
    phone: '+503 2222-1111',
    whatsapp: '50322221111',
    email: 'hola@donarosa.com',
    address: 'Calle Principal #45, Colonia Centro',
    city: 'San Salvador',
    hours: 'Lun-Dom 7:00 AM - 10:00 PM',
    facebook: 'https://facebook.com/donarosa',
    instagram: 'https://instagram.com/donarosa',
    featured: true,
    plan: "premium",
    categorySlug: 'restaurantes',
    products: [
      { name: 'Tamal de elote con crema', description: 'Tamal dulce de elote fresco servido con crema artesanal.', price: 3.5, image: img('tamal-elote'), tag: 'Especialidad' },
      { name: 'Enchiladas rojas (3 pza)', description: 'Tortillas de maíz rellenas de pollo, bañadas en salsa roja.', price: 5.75, image: img('enchiladas-rojas') },
      { name: 'Sopa de res', description: 'Sopa tradicional con carne, vegetales y arroz.', price: 4.25, image: img('sopa-res') },
      { name: 'Empanadas de pollo (4 pza)', description: 'Masa crujiente rellena de pollo desmenuzado.', price: 3.95, image: img('empanadas-pollo') },
      { name: 'Pastel de tres leches', description: 'Bizcocho bañado en tres leches con crema chantilly.', price: 2.95, image: img('pastel-tres-leches'), tag: 'Postre' },
    ],
  },
  {
    name: 'Pizzería Bella Napoli',
    slug: 'pizzeria-bella-napoli',
    description: 'Pizza artesanal al horno de leña con masa de fermentación lenta. Ingredientes importados directamente de Italia.',
    logo: img('bella-napoli-logo', 200, 200),
    cover: img('bella-napoli-cover', 1200, 600),
    phone: '+503 2222-2222',
    whatsapp: '50322222222',
    address: 'Avenida Italia #12, Zona Rosa',
    city: 'San Salvador',
    hours: 'Mar-Dom 12:00 PM - 11:00 PM',
    instagram: 'https://instagram.com/bellanapoli',
    featured: true,
    plan: "premium",
    categorySlug: 'restaurantes',
    products: [
      { name: 'Pizza Margherita (mediana)', description: 'Salsa de tomate San Marzano, mozzarella fresca, albahaca.', price: 9.5, image: img('pizza-margherita'), tag: 'Clásica' },
      { name: 'Pizza Pepperoni (grande)', description: 'Pepperoni importado, mozzarella, orégano.', price: 14.0, image: img('pizza-pepperoni') },
      { name: 'Pizza Cuatro Quesos', description: 'Mozzarella, gorgonzola, parmesano y provolone.', price: 13.5, image: img('pizza-cuatro-quesos') },
      { name: 'Lasagna alla Bolognese', description: 'Capas de pasta con ragú de carne y bechamel.', price: 8.75, image: img('lasagna-bolognese') },
      { name: 'Tiramisú', description: 'Postre italiano con café espresso y mascarpone.', price: 4.5, image: img('tiramisu'), tag: 'Postre' },
    ],
  },
  {
    name: 'Sushi Niwa',
    slug: 'sushi-niwa',
    description: 'Sushi fresco preparado por chefs japoneses. Pescado importado diario y opciones veganas disponibles.',
    logo: img('sushi-niwa-logo', 200, 200),
    cover: img('sushi-niwa-cover', 1200, 600),
    phone: '+503 2222-3333',
    whatsapp: '50322223333',
    address: 'Plleta Japonesa #88, Colonia Escalón',
    city: 'San Salvador',
    hours: 'Lun-Sáb 11:30 AM - 10:30 PM',
    instagram: 'https://instagram.com/sushiniwa',
    categorySlug: 'restaurantes',
    products: [
      { name: 'Roll California (8 pza)', description: 'Cangrejo, aguacate, pepino y sésamo.', price: 7.5, image: img('roll-california'), tag: 'Popular' },
      { name: 'Roll Filadelfia (8 pza)', description: 'Salmón fresco, queso crema y cebollín.', price: 9.0, image: img('roll-filadelfia') },
      { name: 'Nigiri de atún (6 pza)', description: 'Arroz prensado con lámina de atún rojo.', price: 8.5, image: img('nigiri-atun') },
      { name: 'Sashimi variado (12 pza)', description: 'Selección del chef: atún, salmón y hamachi.', price: 14.5, image: img('sashimi-variado') },
      { name: 'Ramen Tonkotsu', description: 'Caldo cremoso de cerdo, fideos, huevo y chashu.', price: 11.0, image: img('ramen-tonkotsu') },
    ],
  },
  {
    name: 'Burger Town',
    slug: 'burger-town',
    description: 'Hamburguesas premium con carne 100% res local, panes artesanales y papas fritas cortadas a mano.',
    logo: img('burger-town-logo', 200, 200),
    cover: img('burger-town-cover', 1200, 600),
    phone: '+503 2222-4444',
    whatsapp: '50322224444',
    address: 'Boulevard Burger #23',
    city: 'Santa Tecla',
    hours: 'Lun-Dom 11:00 AM - 12:00 AM',
    facebook: 'https://facebook.com/burgertown',
    tiktok: 'https://tiktok.com/@burgertown',
    featured: true,
    plan: "premium",
    categorySlug: 'restaurantes',
    products: [
      { name: 'Burger Clásica', description: 'Carne 150g, queso cheddar, lechuga, tomate y salsa casa.', price: 6.5, image: img('burger-clasica'), tag: 'Top' },
      { name: 'Doble Bacon', description: 'Dos carnes, tocino crujiente, queso y cebolla caramelizada.', price: 9.75, image: img('burger-bacon') },
      { name: 'Burger Vegana', description: 'Medallón de lentejas, guacamole y pan integral.', price: 7.5, image: img('burger-vegana') },
      { name: 'Papas fritas grandes', description: 'Cortadas a mano con sal de mar y hierbas.', price: 3.25, image: img('papas-fritas') },
      { name: 'Aros de cebolla', description: 'Empanizados con cerveza artesanal.', price: 4.0, image: img('aros-cebolla') },
    ],
  },
  {
    name: 'Heladería Dulce Frío',
    slug: 'heladeria-dulce-frio',
    description: 'Helados artesanales elaborados con frutas de temporada. Más de 30 sabores disponibles.',
    logo: img('dulce-frio-logo', 200, 200),
    cover: img('dulce-frio-cover', 1200, 600),
    phone: '+503 2222-5555',
    whatsapp: '50322225555',
    address: 'Calle Helada #7, Colonia Miramonte',
    city: 'San Salvador',
    hours: 'Lun-Dom 10:00 AM - 10:00 PM',
    instagram: 'https://instagram.com/dulcefrio',
    categorySlug: 'restaurantes',
    products: [
      { name: 'Helado de fresa (1 bola)', description: 'Hecho con fresas frescas de temporada.', price: 2.25, image: img('helado-fresa') },
      { name: 'Helado de chocolate belga', description: 'Chocolate premium con trozos de cacao.', price: 2.5, image: img('helado-chocolate') },
      { name: 'Sundae de brownie', description: 'Brownie casero con 2 bolas y salsa caliente.', price: 5.5, image: img('sundae-brownie'), tag: 'Especial' },
      { name: 'Malteada de oreo', description: 'Leche, helado de vainilla y galletas oreo.', price: 3.95, image: img('malteada-oreo') },
      { name: 'Banana split', description: 'Tres bolas, banana, salsas y crema chantilly.', price: 6.25, image: img('banana-split') },
    ],
  },

  // ===== DA BBQ PIT (real, Silao Gto) =====
  {
    name: 'Da bbq Pit',
    slug: 'da-bbq-pit',
    description: 'Auténtico BBQ ahumado con leña. Carne tierna, sabores intensos y calidad única. En Silao nadie ahuma así — ahumado lento, sabor inolvidable. Especialidad en brisket, costillas, pulled pork y papas rellenas.',
    logo: localImg('da-bbq-pit', 'logo'),
    cover: localImg('da-bbq-pit', 'cover'),
    phone: '+52 477 148 3773',
    whatsapp: '524771483773',
    address: 'Honda 46, Centro',
    city: 'Silao, Guanajuato',
    hours: 'Jue-Dom 12:00 PM - 9:00 PM (confirmar por WhatsApp)',
    website: 'https://salsaysazones-sudo.github.io/menu-dabbqpit/',
    facebook: 'https://www.facebook.com/DabbqPit1/',
    instagram: 'https://www.instagram.com/dabbqpit/',
    tiktok: 'https://www.tiktok.com/@dabbqpit1',
    featured: true,
    plan: 'premium',
    categorySlug: 'restaurantes',
    products: [
      { name: 'Papa rellena con costilla ahumada', description: 'Papa horneada sazonada con mantequilla y queso amarillo líquido, bañada con salsa estilo BBQ. Incluye costilla ahumada. (tocino incluye brócoli).', price: 90, image: localImg('da-bbq-pit', 'papa-costilla'), tag: 'Top' },
      { name: 'Papa rellena con pulled pork', description: 'Papa horneada con mantequilla, queso amarillo líquido y salsa BBQ. Incluye pulled pork ahumado.', price: 85, image: localImg('da-bbq-pit', 'papa-pulled-pork') },
      { name: 'Papa rellena con tocino crujiente', description: 'Papa horneada con mantequilla, queso amarillo líquido, salsa BBQ y tocino crujiente. Incluye brócoli.', price: 85, image: localImg('da-bbq-pit', 'papa-tocino') },
      { name: 'Costilla "La de la Casa" 500g (3 personas)', description: 'Incluye media papa horneada con mantequilla, 2 piezas de pan tostado con mantequilla y ajo, 1 bastón de pepinillo dulce cítrico. Elige salsa: chipotle dulce o mango habanero.', price: 280, image: localImg('da-bbq-pit', 'costilla-casa'), tag: 'Especialidad' },
      { name: 'Costilla 250g (2 personas)', description: 'Con media papa, pan tostado con ajo y pepinillo. Elige salsa: chipotle dulce o mango habanero.', price: 170, image: localImg('da-bbq-pit', 'costilla-250') },
      { name: 'Costilla 125g (1 persona)', description: 'Porción individual con pan tostado con ajo y pepinillo. Elige salsa: chipotle dulce o mango habanero.', price: 99, image: localImg('da-bbq-pit', 'costilla-125') },
      { name: '3 Mini Burgers', description: 'Jugosa carne molida bien sazonada, jitomate fresco, pepinillos, cebolla morada, queso amarillo americano y crujiente tocino, en suave mini bollo.', price: 99, image: localImg('da-bbq-pit', 'mini-burgers-3'), tag: 'Top' },
      { name: '1 Mini Burger individual', description: 'Carne molida sazonada con jitomate, pepinillos, cebolla morada, queso americano y tocino, en mini bollo.', price: 35, image: localImg('da-bbq-pit', 'mini-burger-1') },
      { name: 'Mini Burger combinada', description: 'Mini burger con combinación de proteínas al gusto.', price: 99, image: localImg('da-bbq-pit', 'mini-burger-combinada') },
      { name: '3 Mini Sandwiches de pulled pork', description: 'Jugoso pulled pork servido en mini bollo calientito, acompañado de slaw de manzana.', price: 110, image: localImg('da-bbq-pit', 'mini-sandwiches-3') },
      { name: '1 Mini Sandwich individual', description: 'Pulled pork en mini bollo con slaw de manzana.', price: 38, image: localImg('da-bbq-pit', 'mini-sandwich-1') },
      { name: 'Coca Cola 600ml', description: 'Refresco Coca Cola bien frío, 600ml.', price: 30, image: localImg('da-bbq-pit', 'coca-600') },
      { name: 'Fresca 600ml', description: 'Refresco Fresca bien frío, 600ml.', price: 30, image: localImg('da-bbq-pit', 'fresca-600') },
      { name: 'Agua fresca de jamaica con té de limón 600ml', description: 'Bebida de la casa: agua fresca de jamaica mezclada con té de limón. Refrescante y natural.', price: 25, image: localImg('da-bbq-pit', 'agua-jamaica'), tag: 'Especialidad' },
      { name: 'Postre del día', description: 'Pregunta a nuestro staff por las delicias disponibles hoy. Postres caseros rotativos.', price: 50, image: localImg('da-bbq-pit', 'postre-dia'), tag: 'Postre' },
    ],
  },

  // ===== CAMARÓN WASH (real, Silao Gto) =====
  {
    name: 'Camarón Wash',
    slug: 'camaron-wash',
    description: 'Auto lavado profesional en Silao. Servicio rápido y de calidad para mantener tu vehículo impecable. Lavado exterior, interior, encerado y más.',
    logo: localImg('camaron-wash', 'logo'),
    cover: localImg('camaron-wash', 'cover'),
    phone: '472 000 0000 (confirmar)',
    whatsapp: '524720000000',
    address: 'Fundación #74, Centro',
    city: 'Silao, Guanajuato',
    hours: 'Confirmar horario por WhatsApp',
    instagram: 'https://www.instagram.com/camaron_wash.mx/',
    tiktok: 'https://www.tiktok.com/@camaron_wash',
    featured: false,
    hidden: false,
    plan: 'gratis',
    categorySlug: 'servicios',
    products: [
      { name: 'Lavado exterior básico', description: 'Lavado completo exterior del vehículo con jabón especial, enjuague y secado.', price: 80, image: localImg('camaron-wash', 'lavado-exterior'), tag: 'Básico' },
      { name: 'Lavado exterior + interior', description: 'Lavado exterior completo más aspirado interior y limpieza de tablero.', price: 150, image: localImg('camaron-wash', 'lavado-completo'), tag: 'Popular' },
      { name: 'Lavado premium', description: 'Lavado exterior + interior + limpieza de motor + sillones + aromatizante.', price: 250, image: localImg('camaron-wash', 'lavado-premium'), tag: 'Premium' },
      { name: 'Encerado', description: 'Aplicación de cera protectora para mantener la pintura brillante y protegida.', price: 200, image: localImg('camaron-wash', 'encerado') },
      { name: 'Pulido de faros', description: 'Restauración de faros opacos para mejorar la visibilidad nocturna.', price: 300, image: localImg('camaron-wash', 'pulido-faros') },
      { name: 'Lavado de motor', description: 'Limpieza profunda del motor con productos especiales que no dañan componentes.', price: 120, image: localImg('camaron-wash', 'lavado-motor') },
      { name: 'Lavado de chasis (camionetas)', description: 'Lavado completo del chasis para vehículos grandes y camionetas.', price: 100, image: localImg('camaron-wash', 'lavado-chasis') },
      { name: 'Aspirado interior', description: 'Aspirado completo de sillones, pisos y cajuelas.', price: 60, image: localImg('camaron-wash', 'aspirado') },
    ],
  },

  // ===== BELLEZA (4) =====
  {
    name: 'Salón Bella Imagen',
    slug: 'salon-bella-imagen',
    description: 'Salón de belleza integral. Corte, color, peinados, tratamientos capilares y maquillaje profesional para eventos.',
    logo: img('bella-imagen-logo', 200, 200),
    cover: img('bella-imagen-cover', 1200, 600),
    phone: '+503 2233-1111',
    whatsapp: '50322331111',
    address: 'Avenida Belleza #100, Colonia San Benito',
    city: 'San Salvador',
    hours: 'Lun-Sáb 9:00 AM - 7:00 PM',
    facebook: 'https://facebook.com/bellaimagen',
    instagram: 'https://instagram.com/bellaimagen',
    featured: true,
    plan: "premium",
    categorySlug: 'belleza',
    products: [
      { name: 'Corte de cabello mujer', description: 'Corte profesional + lavado + peinado.', price: 18.0, image: img('corte-mujer') },
      { name: 'Corte de cabello hombre', description: 'Corte + arreglo de barba.', price: 12.0, image: img('corte-hombre') },
      { name: 'Tinte completo', description: 'Coloración global con productos premium.', price: 35.0, image: img('tinte-completo') },
      { name: 'Mechas balayage', description: 'Técnica balayage para efecto natural.', price: 65.0, image: img('mechas-balayage'), tag: 'Premium' },
      { name: 'Maquillaje de evento', description: 'Maquillaje profesional para ocasiones especiales.', price: 40.0, image: img('maquillaje-evento') },
    ],
  },
  {
    name: 'Spa Manos y Pies',
    slug: 'spa-manos-y-pies',
    description: 'Manicura, pedicura y spa de uñas. Productos veganos y técnicas de larga duración.',
    logo: img('manos-pies-logo', 200, 200),
    cover: img('manos-pies-cover', 1200, 600),
    phone: '+503 2233-2222',
    whatsapp: '50322332222',
    address: 'Plaza Manos #5, Colonia Miralvalle',
    city: 'San Salvador',
    hours: 'Mar-Sáb 9:00 AM - 6:00 PM',
    instagram: 'https://instagram.com/manosypies',
    categorySlug: 'belleza',
    products: [
      { name: 'Manicura tradicional', description: 'Limpieza, forma, cutícula y esmalte.', price: 15.0, image: img('manicura-tradicional') },
      { name: 'Manicura semipermanente', description: 'Esmaltado semipermanente hasta 3 semanas.', price: 25.0, image: img('manicura-semipermanente') },
      { name: 'Pedicura spa', description: 'Tratamiento completo + masaje + esmalte.', price: 30.0, image: img('pedicura-spa'), tag: 'Popular' },
      { name: 'Uñas acrílicas', description: 'Extensión con gel y diseño a elección.', price: 45.0, image: img('unas-acrilicas') },
      { name: 'Diseño nail art', description: 'Decoración personalizada por uña.', price: 8.0, image: img('nail-art') },
    ],
  },
  {
    name: 'Barbería El Navaja',
    slug: 'barberia-el-navaja',
    description: 'Barbería clásica con ambiente moderno. Cortes degradados, arreglo de barba y rituales de afeitado tradicional.',
    logo: img('el-navaja-logo', 200, 200),
    cover: img('el-navaja-cover', 1200, 600),
    phone: '+503 2233-3333',
    whatsapp: '50322333333',
    address: 'Calle Navaja #50, Colonia Escalón',
    city: 'San Salvador',
    hours: 'Lun-Sáb 9:00 AM - 8:00 PM',
    facebook: 'https://facebook.com/elnavaja',
    tiktok: 'https://tiktok.com/@elnavaja',
    featured: true,
    plan: "premium",
    categorySlug: 'belleza',
    products: [
      { name: 'Corte degradado', description: 'Fade profesional con máquina y tijera.', price: 10.0, image: img('corte-degradado'), tag: 'Top' },
      { name: 'Corte + barba', description: 'Combo de corte y arreglo completo de barba.', price: 15.0, image: img('corte-barba') },
      { name: 'Afeitado tradicional', description: 'Afeitado con navaja y toalla caliente.', price: 12.0, image: img('afeitado-tradicional') },
      { name: 'Diseño de cejas', description: 'Perfilado masculino de cejas.', price: 5.0, image: img('diseno-cejas') },
      { name: 'Mascarilla facial', description: 'Limpieza profunda con productos naturales.', price: 8.0, image: img('mascarilla-facial') },
    ],
  },
  {
    name: 'Nails & Beauty Studio',
    slug: 'nails-beauty-studio',
    description: 'Estudio de uñas y belleza especializado en diseños creativos. Técnicas: polygel, acrílico, esmaltado semipermanente.',
    logo: img('nails-studio-logo', 200, 200),
    cover: img('nails-studio-cover', 1200, 600),
    phone: '+503 2233-4444',
    whatsapp: '50322334444',
    address: 'Avenida Estudio #22, Santa Elena',
    city: 'Antiguo Cuscatlán',
    hours: 'Lun-Sáb 10:00 AM - 7:00 PM',
    instagram: 'https://instagram.com/nailsbeautystudio',
    categorySlug: 'belleza',
    products: [
      { name: 'Uñas polygel', description: 'Técnica moderna ligera y resistente.', price: 40.0, image: img('unas-polygel'), tag: 'Nuevo' },
      { name: 'Esmaltado semipermanente', description: 'Acabado brillante por 3 semanas.', price: 22.0, image: img('esmaltado-semipermanente') },
      { name: 'Kapping gel', description: 'Refuerzo de uña natural con gel.', price: 25.0, image: img('kapping-gel') },
      { name: 'Diseño artístico full set', description: 'Diseños personalizados por uña.', price: 55.0, image: img('diseno-artistico') },
      { name: 'Retiro + nuevo servicio', description: 'Retiro seguro + aplicación nueva.', price: 50.0, image: img('retiro-nuevo') },
    ],
  },

  // ===== TIENDAS Y MODA (4) =====
  {
    name: 'Boutique Aurora',
    slug: 'boutique-aurora',
    description: 'Ropa femenina de tendencia. Trajes de baño, vestidos de fiesta y accesorios cuidadosamente seleccionados.',
    logo: img('boutique-aurora-logo', 200, 200),
    cover: img('boutique-aurora-cover', 1200, 600),
    phone: '+503 2244-1111',
    whatsapp: '50322441111',
    address: 'Plaza Aurora #15, Colonia San Benito',
    city: 'San Salvador',
    hours: 'Lun-Sáb 10:00 AM - 8:00 PM',
    facebook: 'https://facebook.com/boutiqueaurora',
    instagram: 'https://instagram.com/boutiqueaurora',
    featured: true,
    plan: "premium",
    categorySlug: 'tiendas',
    products: [
      { name: 'Vestido de fiesta largo', description: 'Vestido elegante con detalles en pedrería.', price: 85.0, image: img('vestido-fiesta'), tag: 'Nuevo' },
      { name: 'Traje de baño bikini', description: 'Conjunto de dos piezas estampado tropical.', price: 32.0, image: img('traje-bano-bikini') },
      { name: 'Blusa de seda', description: 'Blusa fluida en tonos pastel.', price: 25.0, image: img('blusa-seda') },
      { name: 'Pantalón de mezclilla', description: 'Jeans skinny de alta elasticidad.', price: 38.0, image: img('pantalon-mezclilla') },
      { name: 'Aretes statement', description: 'Aretes grandes con diseño exclusivo.', price: 12.0, image: img('aretes-statement') },
    ],
  },
  {
    name: 'Tech Store SV',
    slug: 'tech-store-sv',
    description: 'Tecnología y gadgets al mejor precio. Celulares, accesorios, audio y computación con garantía.',
    logo: img('tech-store-logo', 200, 200),
    cover: img('tech-store-cover', 1200, 600),
    phone: '+503 2244-2222',
    whatsapp: '50322442222',
    address: 'Centro Comercial Tech #200',
    city: 'San Salvador',
    hours: 'Lun-Dom 9:00 AM - 9:00 PM',
    facebook: 'https://facebook.com/techstoresv',
    tiktok: 'https://tiktok.com/@techstoresv',
    featured: true,
    plan: "premium",
    categorySlug: 'tiendas',
    products: [
      { name: 'Audífonos bluetooth', description: 'Cancelación de ruido y 30h batería.', price: 45.0, image: img('audifonos-bluetooth'), tag: 'Top' },
      { name: 'Carga rápida USB-C 20W', description: 'Cargador original certificado.', price: 18.0, image: img('carga-rapida') },
      { name: 'Smartwatch deportivo', description: 'Monitor cardíaco, GPS, sumergible.', price: 65.0, image: img('smartwatch-deportivo') },
      { name: 'Power bank 10000mAh', description: 'Carga rápida dual con display.', price: 28.0, image: img('power-bank') },
      { name: 'Funda silicona iPhone', description: 'Compatible con varios modelos.', price: 8.0, image: img('funda-iphone') },
    ],
  },
  {
    name: 'Calzado Paso Firme',
    slug: 'calzado-paso-firme',
    description: 'Zapatería con más de 30 años. Calzado formal, casual y deportivo para toda la familia. Marca propia y selecta.',
    logo: img('paso-firme-logo', 200, 200),
    cover: img('paso-firme-cover', 1200, 600),
    phone: '+503 2244-3333',
    whatsapp: '50322443333',
    address: 'Calle Calzado #75, Centro Histórico',
    city: 'San Salvador',
    hours: 'Lun-Sáb 9:00 AM - 7:00 PM',
    facebook: 'https://facebook.com/pasofirme',
    categorySlug: 'tiendas',
    products: [
      { name: 'Zapato formal de cuero', description: 'Cuero genuino, suela cosida.', price: 75.0, image: img('zapato-formal') },
      { name: 'Tenis deportivos running', description: 'Amortiguación premium, ultraligeros.', price: 65.0, image: img('tenis-running'), tag: 'Nuevo' },
      { name: 'Sandalias veraniegas', description: 'Cuero natural con plantilla ergonómica.', price: 28.0, image: img('sandalias-verano') },
      { name: 'Botín casual', description: 'Estilo chelsea en gamuza.', price: 55.0, image: img('botin-casual') },
      { name: 'Mocasines de dama', description: 'Comfort interior con detalle exterior.', price: 42.0, image: img('mocasines-dama') },
    ],
  },
  {
    name: 'Regalos Detalles Únicos',
    slug: 'regalos-detalles-unicos',
    description: 'Tienda de regalos personalizados. Cajas sorpresa, arreglos, tazas personalizadas y decoración para el hogar.',
    logo: img('detalles-unicos-logo', 200, 200),
    cover: img('detalles-unicos-cover', 1200, 600),
    phone: '+503 2244-4444',
    whatsapp: '50322444444',
    address: 'Plaza Detalles #30, Colonia Flor Blanca',
    city: 'San Salvador',
    hours: 'Lun-Dom 10:00 AM - 8:00 PM',
    instagram: 'https://instagram.com/detallesunicos',
    categorySlug: 'tiendas',
    products: [
      { name: 'Caja sorpresa personalizada', description: 'Incluye dulces, flores y mensaje.', price: 35.0, image: img('caja-sorpresa'), tag: 'Top' },
      { name: 'Taza personalizada con foto', description: 'Sublimación sobre cerámica.', price: 12.0, image: img('taza-personalizada') },
      { name: 'Arreglo de globos', description: 'Decoración para fiestas y eventos.', price: 28.0, image: img('arreglo-globos') },
      { name: 'Vela aromática artesanal', description: 'Cera de soya con fragancia duradera.', price: 18.0, image: img('vela-aromatica') },
      { name: 'Set de spa casero', description: 'Sales, jabones y mascarillas naturales.', price: 32.0, image: img('set-spa-casero') },
    ],
  },

  // ===== SERVICIOS (4) =====
  {
    name: 'Electricidad Pro SV',
    slug: 'electricidad-pro-sv',
    description: 'Servicios eléctricos residenciales y comerciales. Instalaciones, reparaciones y mantenimiento preventivo.',
    logo: img('electricidad-pro-logo', 200, 200),
    cover: img('electricidad-pro-cover', 1200, 600),
    phone: '+503 2255-1111',
    whatsapp: '50322551111',
    address: 'Servicio a domicilio toda el área metropolitana',
    city: 'San Salvador',
    hours: 'Lun-Sáb 8:00 AM - 6:00 PM',
    facebook: 'https://facebook.com/electricidadprosv',
    featured: true,
    plan: "premium",
    categorySlug: 'servicios',
    products: [
      { name: 'Visita técnica + diagnóstico', description: 'Evaluación y presupuesto en sitio.', price: 15.0, image: img('visita-tecnica') },
      { name: 'Instalación de chofera', description: 'Incluye accesorios básicos.', price: 45.0, image: img('instalacion-chofera') },
      { name: 'Reparación de tomacorrientes', description: 'Hasta 5 tomas con materiales.', price: 35.0, image: img('reparacion-tomas') },
      { name: 'Tablero eléctrico completo', description: 'Instalación con breakers certificados.', price: 180.0, image: img('tablero-electrico'), tag: 'Especializado' },
      { name: 'Mantenimiento preventivo', description: 'Revisión completa del sistema.', price: 60.0, image: img('mantenimiento-electrico') },
    ],
  },
  {
    name: 'Plomería Express',
    slug: 'plomeria-express',
    description: 'Soluciones rápidas de plomería. Filtraciones, instalaciones, destapados y mantenimiento. Servicio de emergencia 24/7.',
    logo: img('plomeria-express-logo', 200, 200),
    cover: img('plomeria-express-cover', 1200, 600),
    phone: '+503 2255-2222',
    whatsapp: '50322552222',
    address: 'Atención a domicilio en toda la ciudad',
    city: 'San Salvador',
    hours: 'Lun-Dom 7:00 AM - 10:00 PM',
    facebook: 'https://facebook.com/plomeriaexpress',
    categorySlug: 'servicios',
    products: [
      { name: 'Destapado de cañería', description: 'Servicio básico sin demolición.', price: 25.0, image: img('destapado-cane'), tag: 'Popular' },
      { name: 'Reparación de fuga', description: 'Localización y reparación garantizada.', price: 35.0, image: img('reparacion-fuga') },
      { name: 'Instalación de inodoro', description: 'Incluye sellado y prueba.', price: 55.0, image: img('instalacion-inodoro') },
      { name: 'Mantenimiento calentador', description: 'Revisión + limpieza interna.', price: 40.0, image: img('mantenimiento-calentador') },
      { name: 'Servicio de emergencia', description: 'Atención fuera de horario hábil.', price: 50.0, image: img('emergencia-plomeria') },
    ],
  },
  {
    name: 'Limpieza Profunda Hogar',
    slug: 'limpieza-profunda-hogar',
    description: 'Servicios de limpieza residencial y comercial. Profunda, post-construcción, mudanzas. Personal confiable y capacitado.',
    logo: img('limpieza-hogar-logo', 200, 200),
    cover: img('limpieza-hogar-cover', 1200, 600),
    phone: '+503 2255-3333',
    whatsapp: '50322553333',
    address: 'Cobertura en San Salvador y La Libertad',
    city: 'San Salvador',
    hours: 'Lun-Sáb 7:00 AM - 6:00 PM',
    facebook: 'https://facebook.com/limpiezahogarsv',
    instagram: 'https://instagram.com/limpiezahogarsv',
    featured: true,
    plan: "premium",
    categorySlug: 'servicios',
    products: [
      { name: 'Limpieza profunda (3 horas)', description: 'Equipo de 2 personas + insumos.', price: 55.0, image: img('limpieza-profunda'), tag: 'Top' },
      { name: 'Limpieza post-construcción', description: 'Remoción de polvo y residuos.', price: 120.0, image: img('limpieza-post-construccion') },
      { name: 'Limpieza de alfombras', description: 'Lavado con máquina profesional.', price: 35.0, image: img('limpieza-alfombras') },
      { name: 'Limpieza de vidrios', description: 'Hasta 10 ventanas con productos especiales.', price: 30.0, image: img('limpieza-vidrios') },
      { name: 'Mantenimiento semanal', description: 'Plan mensual con descuento.', price: 180.0, image: img('mantenimiento-semanal') },
    ],
  },
  {
    name: 'Transporte Ejecutivo SV',
    slug: 'transporte-ejecutivo-sv',
    description: 'Servicio de transporte privado con chofer. Traslados al aeropuerto, ejecutivos y tours personalizados.',
    logo: img('transporte-ejecutivo-logo', 200, 200),
    cover: img('transporte-ejecutivo-cover', 1200, 600),
    phone: '+503 2255-4444',
    whatsapp: '50322554444',
    address: 'Cobertura nacional',
    city: 'San Salvador',
    hours: 'Servicio 24/7',
    facebook: 'https://facebook.com/transporteejecutivosv',
    categorySlug: 'servicios',
    products: [
      { name: 'Traslado aeropuerto (ida)', description: 'San Salvador → Monseñor Romero.', price: 35.0, image: img('traslado-aeropuerto'), tag: 'Popular' },
      { name: 'Hora de servicio ejecutivo', description: 'Vehículo con chofer por hora.', price: 25.0, image: img('hora-ejecutivo') },
      { name: 'Tour ciudad medio día', description: 'Recorrido de 4h por puntos turísticos.', price: 90.0, image: img('tour-ciudad') },
      { name: 'Renta diaria con chofer', description: 'Hasta 10h dentro de la ciudad.', price: 180.0, image: img('renta-diaria') },
      { name: 'Traslado interdepartamental', description: 'A cualquier punto del país.', price: 120.0, image: img('traslado-inter') },
    ],
  },

  // ===== SALUD Y BIENESTAR (3) =====
  {
    name: 'Farmacia Natural Vida',
    slug: 'farmacia-natural-vida',
    description: 'Medicina natural, suplementos, hierbas y productos holísticos. Asesoría con naturópatas certificados.',
    logo: img('farmacia-vida-logo', 200, 200),
    cover: img('farmacia-vida-cover', 1200, 600),
    phone: '+503 2266-1111',
    whatsapp: '50322661111',
    address: 'Avenida Natural #10, Colonia Médica',
    city: 'San Salvador',
    hours: 'Lun-Sáb 8:00 AM - 8:00 PM',
    facebook: 'https://facebook.com/farmaciavida',
    instagram: 'https://instagram.com/farmaciavida',
    featured: true,
    plan: "premium",
    categorySlug: 'salud',
    products: [
      { name: 'Té detox hierbas', description: 'Mezcla depurativa de 15 hierbas.', price: 12.0, image: img('te-detox') },
      { name: 'Suplemento vitamina C', description: 'Vitamina C liposomal 1000mg.', price: 18.0, image: img('vitamina-c'), tag: 'Top' },
      { name: 'Aceite esencial lavanda', description: '100% puro para aromaterapia.', price: 14.0, image: img('aceite-lavanda') },
      { name: 'Cápsulas cúrcuma', description: 'Antiinflamatorio natural 60 caps.', price: 22.0, image: img('curcuma-caps') },
      { name: 'Jabón artesanal de carbón', description: 'Purificante para piel mixta.', price: 6.5, image: img('jabon-carbon') },
    ],
  },
  {
    name: 'Yoga Studio Paz Mental',
    slug: 'yoga-studio-paz-mental',
    description: 'Estudio de yoga y meditación. Clases para todos los niveles, talleres especializados y retiros mensuales.',
    logo: img('yoga-paz-logo', 200, 200),
    cover: img('yoga-paz-cover', 1200, 600),
    phone: '+503 2266-2222',
    whatsapp: '50322662222',
    address: 'Plaza Zen #5, Colonia San Benito',
    city: 'San Salvador',
    hours: 'Lun-Sáb 6:00 AM - 9:00 PM',
    instagram: 'https://instagram.com/pazmentalyoga',
    categorySlug: 'salud',
    products: [
      { name: 'Clase de yoga individual', description: 'Sesión privada de 60 minutos.', price: 25.0, image: img('clase-individual') },
      { name: 'Clase grupal (1 sesión)', description: 'Grupos reducidos máximo 12.', price: 10.0, image: img('clase-grupal'), tag: 'Popular' },
      { name: 'Membresía mensual ilimitada', description: 'Acceso a todas las clases del mes.', price: 75.0, image: img('membresia-mensual') },
      { name: 'Taller de meditación', description: 'Sesión profunda de 90 minutos.', price: 30.0, image: img('taller-meditacion') },
      { name: 'Pack 10 clases', description: 'Válido por 3 meses.', price: 80.0, image: img('pack-10-clases') },
    ],
  },
  {
    name: 'Centro Nutrición Integral',
    slug: 'centro-nutricion-integral',
    description: 'Consultoría en nutrición clínica y deportiva. Planes personalizados, control de peso y seguimiento profesional.',
    logo: img('nutricion-integral-logo', 200, 200),
    cover: img('nutricion-integral-cover', 1200, 600),
    phone: '+503 2266-3333',
    whatsapp: '50322663333',
    address: 'Centro Médico Integral #18',
    city: 'San Salvador',
    hours: 'Lun-Vie 8:00 AM - 6:00 PM',
    facebook: 'https://facebook.com/nutricionintegralsv',
    categorySlug: 'salud',
    products: [
      { name: 'Primera consulta + plan', description: 'Evaluación completa y plan inicial.', price: 45.0, image: img('primera-consulta'), tag: 'Inicio' },
      { name: 'Consulta de seguimiento', description: 'Revisión de avance y ajustes.', price: 25.0, image: img('consulta-seguimiento') },
      { name: 'Plan deportivo personalizado', description: 'Nutrición deportiva con macros.', price: 65.0, image: img('plan-deportivo') },
      { name: 'Paquete mensual (4 sesiones)', description: 'Seguimiento semanal intensivo.', price: 90.0, image: img('paquete-mensual') },
      { name: 'Antropometría ISAK', description: 'Medición corporal profesional.', price: 35.0, image: img('antropometria') },
    ],
  },
]

async function main() {
  console.log('🧹 Limpiando DB...')
  await db.product.deleteMany()
  await db.business.deleteMany()
  await db.category.deleteMany()

  console.log('📁 Creando categorías...')
  for (const c of categories) {
    await db.category.create({ data: c })
  }

  console.log('🏪 Creando negocios y productos...')
  let count = 0
  for (const b of businesses) {
    const cat = await db.category.findUnique({ where: { slug: b.categorySlug } })
    if (!cat) throw new Error(`Categoría no encontrada: ${b.categorySlug}`)

    const { products, categorySlug, ...businessData } = b
    const business = await db.business.create({
      data: {
        ...businessData,
        categoryId: cat.id,
      },
    })

    for (const p of products) {
      await db.product.create({
        data: { ...p, businessId: business.id },
      })
    }
    count++
    console.log(`  ✅ ${count}. ${b.name} (${products.length} productos)`)
  }

  console.log(`\n🎉 Seed completo: ${count} negocios, ${categories.length} categorías`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
