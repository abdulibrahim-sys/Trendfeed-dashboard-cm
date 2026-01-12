import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trendfeed Dashboard - Cold Email Analytics",
  description: "Analytics dashboard for Instantly.ai cold email campaigns",
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
