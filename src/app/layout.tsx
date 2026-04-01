import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dou's Trip",
  description: "Plan your trips with AI-powered store discovery and route planning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F2EBE0] min-h-screen">{children}</body>
    </html>
  );
}
