import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/common/components/Navbar";
import Footer from "@/common/components/Footer";
import { Toaster } from "@/common/components/ui/toaster";
import Provider from "@/common/components/Provider";
import { Suspense } from "react";
import Loading from "./loading";
import { redirect } from "next/navigation";
import ProdNavbar from "@/common/components/ProdNavbar";
import Script from "next/script";
import MicrosoftClarity from "@/app/metrics/MicrosoftClarity";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    template: '%s - Mockbird',
    default: 'Mockbird',
  },
  openGraph: {
    title: 'Mockbird',
    description: 'Enabling candidates to practice and seek feedback from verified recruiters in industry.',
    locale: 'en_US',
    siteName: 'Mockbird',
    type: 'website',
    images: [
      {
        url: 'https://www.mockbird.ai/mockbird_logo.svg',
        width: 500,
        height: 500,
        alt: 'mockbird logo',
      },
    ],
  },
  description: "Enabling candidates to practice and seek feedback from verified recruiters in industry.",
  alternates: {
    canonical: "https://www.mockbird.ai",
  }
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
          <main className={lato.className}>
            {process.env.NODE_ENV === "production" ? (
              <ProdNavbar />
            ) : <Navbar /> }
            
              <Suspense fallback={<Loading />}>
                {children}
                <MicrosoftClarity />
              </Suspense>
            <Footer />
            <Toaster />
          </main>
        </Provider>
      </body>
    </html>
  );
}
