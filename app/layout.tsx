import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Plug In - Discover Events in Barbados",
  description: "Plug In is the events app that helps you discover what's happening across Barbados.",
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
    </html>
  );
}
