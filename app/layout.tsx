import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elefun Pakkebygger – Prototype",
  description: "Interaktiv prototype for kompatible RC-pakker og komponentvalg.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="antialiased">{children}</body>
    </html>
  );
}
