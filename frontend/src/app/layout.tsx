import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "WeatherGPT — AI Weather & Disaster Copilot",
  description: "AI-powered multilingual weather intelligence and disaster preparedness platform for India. Get live weather, risk scores, route safety, and disaster alerts.",
  keywords: ["weather", "AI", "India", "disaster", "forecast", "IMD", "rainfall", "WeatherGPT"],
  authors: [{ name: "WeatherGPT Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f326.png",
  },
  openGraph: {
    type: "website",
    title: "WeatherGPT — AI Weather & Disaster Copilot",
    description: "Understand the weather. Predict the risk. Take the right action.",
    images: ["https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/512x512/1f326.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
