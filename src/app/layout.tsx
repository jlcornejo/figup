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
  themeColor: "#1a1145",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="text-app-text min-h-screen antialiased album-shapes-bg">
        {/* FIFA WC 2026 style background — colorful mosaic blocks with semicircle cutouts */}
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-70"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 1200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Row 1 - top */}
          <rect x="0" y="0" width="200" height="200" fill="#3b55c8" />
          <rect x="200" y="0" width="200" height="200" fill="#e8233f" />
          <rect x="400" y="0" width="200" height="200" fill="#44c910" />
          <rect x="600" y="0" width="200" height="200" fill="#ff8c1a" />
          {/* Semicircles cutting into row 1 */}
          <circle cx="200" cy="200" r="80" fill="#0ad4e8" />
          <circle cx="400" cy="0" r="70" fill="#8c3df7" />
          <circle cx="600" cy="200" r="90" fill="#ffcf26" />
          <circle cx="100" cy="0" r="60" fill="#e83d8c" />

          {/* Row 2 */}
          <rect x="0" y="200" width="200" height="200" fill="#0ad4e8" />
          <rect x="200" y="200" width="200" height="200" fill="#8c3df7" />
          <rect x="400" y="200" width="200" height="200" fill="#e8233f" />
          <rect x="600" y="200" width="200" height="200" fill="#3b55c8" />
          {/* Semicircles */}
          <circle cx="100" cy="400" r="70" fill="#44c910" />
          <circle cx="400" cy="300" r="80" fill="#ffcf26" />
          <circle cx="700" cy="200" r="60" fill="#ff8c1a" />
          <circle cx="300" cy="200" r="65" fill="#e8233f" />

          {/* Row 3 */}
          <rect x="0" y="400" width="200" height="200" fill="#ff8c1a" />
          <rect x="200" y="400" width="200" height="200" fill="#44c910" />
          <rect x="400" y="400" width="200" height="200" fill="#3b55c8" />
          <rect x="600" y="400" width="200" height="200" fill="#e83d8c" />
          {/* Semicircles */}
          <circle cx="200" cy="500" r="75" fill="#8c3df7" />
          <circle cx="500" cy="600" r="85" fill="#0ad4e8" />
          <circle cx="800" cy="500" r="70" fill="#44c910" />
          <circle cx="0" cy="500" r="60" fill="#e8233f" />

          {/* Row 4 */}
          <rect x="0" y="600" width="200" height="200" fill="#8c3df7" />
          <rect x="200" y="600" width="200" height="200" fill="#0ad4e8" />
          <rect x="400" y="600" width="200" height="200" fill="#ffcf26" />
          <rect x="600" y="600" width="200" height="200" fill="#44c910" />
          {/* Semicircles */}
          <circle cx="300" cy="600" r="70" fill="#e8233f" />
          <circle cx="600" cy="800" r="80" fill="#3b55c8" />
          <circle cx="100" cy="800" r="65" fill="#ff8c1a" />
          <circle cx="700" cy="700" r="60" fill="#e83d8c" />

          {/* Row 5 */}
          <rect x="0" y="800" width="200" height="200" fill="#e8233f" />
          <rect x="200" y="800" width="200" height="200" fill="#ff8c1a" />
          <rect x="400" y="800" width="200" height="200" fill="#8c3df7" />
          <rect x="600" y="800" width="200" height="200" fill="#0ad4e8" />
          {/* Semicircles */}
          <circle cx="200" cy="900" r="75" fill="#44c910" />
          <circle cx="500" cy="800" r="70" fill="#ffcf26" />
          <circle cx="800" cy="900" r="80" fill="#e8233f" />
          <circle cx="0" cy="900" r="55" fill="#3b55c8" />

          {/* Row 6 */}
          <rect x="0" y="1000" width="200" height="200" fill="#44c910" />
          <rect x="200" y="1000" width="200" height="200" fill="#e83d8c" />
          <rect x="400" y="1000" width="200" height="200" fill="#0ad4e8" />
          <rect x="600" y="1000" width="200" height="200" fill="#e8233f" />
          {/* Semicircles */}
          <circle cx="100" cy="1000" r="70" fill="#8c3df7" />
          <circle cx="400" cy="1200" r="80" fill="#ff8c1a" />
          <circle cx="700" cy="1100" r="65" fill="#ffcf26" />
          <circle cx="300" cy="1100" r="60" fill="#3b55c8" />
        </svg>

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
