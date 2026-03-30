import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="min-h-screen flex items-center justify-center text-center bg-linear-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Discover Events in Barbados
        </h1>
        <p className="text-lg md:text-xl mb-3 text-white/90">
          Plug In is the easiest way to find and attend concerts, sports, festivals, and cultural
          experiences happening across Barbados.
        </p>
        <p className="text-base md:text-lg mb-10 text-white/80">
          From intimate local events to major island-wide celebrations — your next unforgettable
          experience starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={PUBLIC_ROUTES.events}
            className="inline-block px-8 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#764ba2]"
          >
            Browse Events
          </Link>
          <Link
            href={PUBLIC_ROUTES.contactUs}
            className="inline-block px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg border border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#764ba2]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
