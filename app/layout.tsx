import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabHub",
  description: "CollabHub description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <ReduxProvider>
          <body className={`${inter.className} antialiased`}>
            <Toaster richColors/>
            <Header />
            {children}
          </body>
        </ReduxProvider>
      </SessionProvider>
    </html>
  );
}
