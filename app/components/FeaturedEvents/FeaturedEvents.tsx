import Link from 'next/link';
import { HOMEPAGE_FEATURED_EMPTY_STATE } from '@/app/lib/public-content';
import type { PublicEventSummary } from '@/app/types/public-content';
import styles from './FeaturedEvents.module.css';

interface FeaturedEventsProps {
  events: PublicEventSummary[];
}

export default function FeaturedEvents({ events }: Readonly<FeaturedEventsProps>) {
  return (
    <section aria-labelledby="featured-events-heading" className="py-16 px-4 bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto">
        <h2
          id="featured-events-heading"
          className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-10 text-center"
        >
          Featured Events
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={event.detailHref} className={styles.eventCard}>
                <div
                  className="w-full h-48 rounded-lg mb-4 bg-linear-to-br from-[#667eea] to-[#764ba2]"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-[#1a1a2e] mb-2">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{event.dateLabel}</p>
                {event.locationLabel && (
                  <p className="text-gray-400 text-xs mb-2">{event.locationLabel}</p>
                )}
                <span className="inline-block bg-[#ff6b6b] text-white text-xs px-3 py-1 rounded-full">
                  {event.category}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-gray-600 text-lg mb-6">{HOMEPAGE_FEATURED_EMPTY_STATE.message}</p>
            <Link
              href={HOMEPAGE_FEATURED_EMPTY_STATE.ctaHref}
              className="inline-block px-8 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2"
            >
              {HOMEPAGE_FEATURED_EMPTY_STATE.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
