import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Directorio Locales Centro Silao · Comercios de Silao, Guanajuato",
  description:
    "Descubre y conecta con los mejores negocios del centro de Silao, Guanajuato. Cada negocio tiene su propia URL para compartir en Facebook, TikTok y WhatsApp.",
  keywords: [
    "directorio",
    "negocios",
    "comercios locales",
    "catálogo",
    "Silao",
    "Guanajuato",
    "centro Silao",
    "México",
  ],
  authors: [{ name: "Directorio Locales Centro Silao" }],
  openGraph: {
    title: "Directorio Locales Centro Silao",
    description:
      "Descubre y conecta con los mejores negocios del centro de Silao, Guanajuato.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Directorio Locales Centro Silao",
    description: "Descubre y conecta con los mejores negocios del centro de Silao.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
