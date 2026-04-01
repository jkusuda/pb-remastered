import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ExtensionAuthBridge from "@/components/auth/ExtensionAuthBridge";

const baseFont = Outfit({ 
  subsets: ["latin"], 
  display: 'swap', 
  variable: '--font-base' 
});

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
      </head>
      <body className={`${baseFont.variable} font-sans antialiased text-black`}>
        <ExtensionAuthBridge />
        {children}
      </body>
    </html>
  );
}
