import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amaravathi Travel Admin",
  description: "Private inventory management for Amaravathi Tours & Travel.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
