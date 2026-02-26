import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokebrowser",
  description: "Catch Pokémon while you browse the web.",
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
