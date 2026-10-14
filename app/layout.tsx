import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "McMEME — Together tastes funnier",
  description: "Two trays. One inside joke. A collaborative food-meme studio. Independent demo, no real ordering.",
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
