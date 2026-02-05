import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import { SnackbarProvider } from "@/components/context/SnackbarContext";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/QueryProvider";
import CartInitializer from "@/components/CartInitializer";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import GlobalLoader from "@/components/GlobalLoader";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Icon Shoppers",
  description: "Unified Shopping Experience",
  icons: {
    icon: "/icon.png", 
  },
};

import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <QueryProvider>
          <SnackbarProvider>
            <CartInitializer />
            <AuthInitializer />
            <GlobalLoader />
            {children}
            <ScrollToTop />
          </SnackbarProvider>
        </QueryProvider>


        <Toaster 
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "group toast group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:border-red-600 group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-red-100",
              actionButton: "group-[.toast]:bg-red-600 group-[.toast]:text-white",
              cancelButton: "group-[.toast]:bg-red-400 group-[.toast]:text-white",
            },
          }}
        />
      </body>
    </html>
  );
}