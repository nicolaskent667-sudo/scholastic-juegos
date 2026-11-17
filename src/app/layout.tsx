import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Picnic de Amigos — Rompecabezas",
  description:
    "Armá el rompecabezas del picnic de los animalitos arrastrando las piezas a su lugar.",
};

export const viewport: Viewport = {
  themeColor: "#fbe3ec",
  // El juego se arrastra con el dedo: el zoom por pinch estorba más de lo que ayuda.
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${baloo.variable} antialiased`}>
      {/* El alto mínimo (100dvh) sale de globals.css */}
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
