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
  title: "Accessibility Viewer",
  description: "An application to view websites with accessibility optimizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
