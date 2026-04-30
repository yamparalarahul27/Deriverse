import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import {
  GeistPixelGrid,
} from 'geist/font/pixel';
import "./globals.css";
import '@pqina/flip/dist/flip.min.css';
import LoadingScreen from "@/components/ui/LoadingScreen";
import MobileRestrictedView from "@/components/layout/MobileRestrictedView";
import Providers from "./providers";
import { Toaster } from "sonner";

// Agentation is a dev-time agent overlay. Loaded only when NODE_ENV is
// "development"; in a production build the conditional resolves to null
// at compile time, so the dynamic import is dead-code-eliminated and
// the `agentation` package is never bundled into the client chunk.
const AgentationOverlay =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dev/AgentationOverlay"), {
        ssr: false,
      })
    : null;

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
    <html lang="en" suppressHydrationWarning>
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
        {AgentationOverlay ? <AgentationOverlay /> : null}
      </body>
    </html>
  );
}
