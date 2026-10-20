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
  title: "Plaza SV · Directorio Digital de Negocios",
  description:
    "Descubre y conecta con los mejores negocios locales. Cada negocio tiene su propia URL para compartir en Facebook, TikTok y WhatsApp.",
  keywords: [
    "directorio",
    "negocios",
    "comercios locales",
    "catálogo",
    "San Salvador",
    "El Salvador",
  ],
  authors: [{ name: "Plaza SV" }],
  openGraph: {
    title: "Plaza SV · Directorio Digital de Negocios",
    description:
      "Descubre y conecta con los mejores negocios locales.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plaza SV · Directorio Digital",
    description: "Descubre y conecta con los mejores negocios locales.",
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
