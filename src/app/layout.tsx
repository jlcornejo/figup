import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FigUp - Álbum Mundial 2026",
  description:
    "Controlá tu colección de figuritas del álbum Panini FIFA World Cup 2026. Marcá las que tenés, las repetidas, y completá tu álbum.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a1035",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-panini-darker text-panini-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
