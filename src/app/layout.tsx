import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookura",
  description: "Aura of cooking something far beyond than a developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#F4F3EF] h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
