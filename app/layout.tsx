import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador de sitios para negocios",
  description:
    "Pega tu enlace de Google Maps y obtén el sitio web de tu negocio en minutos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
