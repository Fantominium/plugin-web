import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';

export const metadata: Metadata = {
  title: 'Plug In - Discover Events in Barbados',
  description:
    "Plug In is the events app that helps you discover what's happening across Barbados.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {modal}
        <Footer />
      </body>
    </html>
  );
}
