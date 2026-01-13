import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google"; // Import both fonts
import "./globals.css";
import { Providers } from "./Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Innovera — Built for modern product teams",
  description: "Innovera helps product teams plan, ship, and measure with clarity and speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${kanit.variable} antialiased selection:bg-white/10 selection:text-white bg-neutral-950 font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
