import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import ClientPage from "./page";

export const metadata: Metadata = {
  title: "Console | Heylabs",
  description: "Welcome to Heylabs Console — your workspace to build, deploy, and manage Heylabs-powered solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <ClientPage>
              {children}
            </ClientPage>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster 
            expand={true}
            position="top-right"
            richColors={true}
        />
      </body>
    </html>
  );
}
