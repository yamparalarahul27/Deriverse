import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import {
  GeistPixelGrid,
} from 'geist/font/pixel';
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MobileRestrictedView from "@/components/layout/MobileRestrictedView";
import Providers from "./providers";
import { Toaster } from "sonner";
import AgentationOverlayMount from "@/components/dev/AgentationOverlayMount";

export const metadata: Metadata = {
  title: "Deriverse",
  description: "Deriverse Trade Lookup and Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`
          ${GeistSans.variable} 
          ${GeistMono.variable} 
          ${GeistPixelGrid.variable} 
          antialiased
        `}
      >
        <Providers>
          <div className="hidden md:block h-full">
            {children}
          </div>
          <LoadingScreen />
        </Providers>
        <Toaster
          position="top-right"
          theme="dark"
          closeButton
          expand={false}
          offset={24}
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              color: 'white',
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '14px',
              padding: '16px 20px',
            },
          }}
        />
        <AgentationOverlayMount />
      </body>
    </html>
  );
}
