import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Proven",
  description: "Bet on Yourself, Get Rewarded" ,

  openGraph: {
    title: "Proven",
    description: "Bet on Yourself, Get Rewarded",  
    url: "https://tryproven.fun/",
    siteName: "Proven",
    images: [
      {
        url:"/open-graph.png", // image link
        width: 1200,
        height: 500,
        alt: "Proven",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
