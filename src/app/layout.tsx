import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-instrument-serif"
});

export const metadata: Metadata = {
  title: "MATH.OS",
  description: "A premium AI mathematics learning operating system.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" }
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg"
  },
  appleWebApp: {
    capable: true,
    title: "MATH.OS",
    statusBarStyle: "black-translucent"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans bg-background text-text antialiased selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}
