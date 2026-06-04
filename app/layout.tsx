import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Business Site Generator",
  description:
    "Paste your Google Maps link and get a live business website in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
