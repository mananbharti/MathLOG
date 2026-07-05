import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
