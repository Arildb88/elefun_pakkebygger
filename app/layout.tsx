import type { Metadata } from "next";
import ElefunChrome from "@/components/elefun-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elefun Pakkebygger",
  description: "Finn kompatibelt batteri og bygg RC-pakke hos Elefun.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Signika:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased"><ElefunChrome>{children}</ElefunChrome></body>
    </html>
  );
}
