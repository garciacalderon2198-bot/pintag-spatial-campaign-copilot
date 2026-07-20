import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PINTAG Spatial Campaign Copilot",
  description:
    "An independent OpenAI Build Week 2026 prototype for place-bound local campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
