import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "GridSense",
  description: "Electricity Bill Tracker",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}