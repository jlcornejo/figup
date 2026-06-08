import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FigUp - Álbum Mundial 2026",
  description:
    "Controlá tu colección de figuritas del álbum Panini FIFA World Cup 2026. Marcá las que tenés, las repetidas, y completá tu álbum.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f23",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="text-app-text min-h-screen antialiased album-shapes-bg">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
