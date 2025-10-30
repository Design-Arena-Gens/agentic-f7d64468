import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Newsletter & Blog Writer",
  description: "Create engaging newsletters and blog posts with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
