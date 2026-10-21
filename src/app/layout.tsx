import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
        className={`font-sans antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
