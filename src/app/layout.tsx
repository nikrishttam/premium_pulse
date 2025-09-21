import type { Metadata } from "next";
import "./globals.css";
import { description, title } from "@/lib/constants";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: title,
  description: description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
      <Analytics />
    </html>
  );
}
