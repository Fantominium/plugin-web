import AppPromotion from '@/app/components/AppPromotion/AppPromotion';
import Categories from '@/app/components/Categories/Categories';
import FeaturedEvents from '@/app/components/FeaturedEvents/FeaturedEvents';
import Hero from '@/app/components/Hero/Hero';
import { fetchEventList } from '@/app/lib/event-service';
import type { Event } from '@/app/types/event';
import type { PublicEventSummary } from '@/app/types/public-content';

function toPublicEventSummary(event: Event): PublicEventSummary {
  return {
    id: String(event.id),
    title: event.title,
    category: event.category,
    dateLabel: event.date,
    locationLabel: event.location,
    detailHref: `/events/${event.id}`,
    imageAlt: `${event.title} event`,
  };
}

export default async function Home() {
  let events: PublicEventSummary[] = [];

  try {
    const result = await fetchEventList({ limit: 4, page: 1 });
    events = (result.data ?? []).map(toPublicEventSummary);
  } catch {
    // Event service unavailable — FeaturedEvents will show the empty-state (FR-028A)
  }

  return (
    <>
      <Hero />
      <AppPromotion />
      <Categories />
      <FeaturedEvents events={events} />
    </>
  );
}
