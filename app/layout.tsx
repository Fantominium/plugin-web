import type { Metadata, Viewport } from 'next';
import './globals.css';
import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';

export const metadata: Metadata = {
  title: {
    default: 'Plug In – Discover Events in Barbados',
    template: '%s | Plug In',
  },
  description:
    "Plug In is the events app that helps you discover what's happening across Barbados.",
  applicationName: 'Plug In',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
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
        {/*
          The Header component renders a skip link targeting #main-content.
          This <main> element owns that id so the skip link resolves correctly
          without the Header needing to emit a duplicate empty landmark.
          Individual page components render their own content inside {children}.
        */}
        <main id="main-content">
          {children}
          {modal}
        </main>
        <Footer />
      </body>
    </html>
  );
}
