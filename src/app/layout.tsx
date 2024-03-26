import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/common/components/Navbar";
import Footer from "@/common/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/common/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SteathXI",
  description: "Ace your Next Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <main>
            <Navbar />
              {children}
            <Footer />
            <Toaster />
          </main>
        </Provider>
      </body>
    </html>
  );
}
