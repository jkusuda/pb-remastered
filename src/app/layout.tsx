import type { Metadata } from "next";
import "./globals.css";
import ExtensionAuthBridge from "@/components/auth/ExtensionAuthBridge";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ExtensionAuthBridge />
        {children}
      </body>
    </html>
  );
}
