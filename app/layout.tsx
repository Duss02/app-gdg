import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserConfigProvider } from "./context/UserConfigContext";
import { AccessibilityStyler } from "./components/AccessibilityStyler";
import { ColorBlindFilters } from "./components/ColorBlindFilters";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visualizzatore di Accessibilità",
  description: "Un'applicazione per visualizzare siti web con ottimizzazioni di accessibilità",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserConfigProvider>
          <AccessibilityStyler />
          <ColorBlindFilters />
          {children}
        </UserConfigProvider>
      </body>
    </html>
  );
}
