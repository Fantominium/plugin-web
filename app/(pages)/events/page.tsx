import Link from 'next/link';
import { fetchEventList } from '@/app/lib/event-service';

export default async function EventsPage() {
  const eventList = await fetchEventList({ page: 1, limit: 24 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Discover Events</h1>
        <p className="mt-3 text-lg text-[#495057]">Find upcoming events across Barbados.</p>
      </header>

      {eventList.data.length === 0 ? (
        <section
          aria-label="No events available"
          className="rounded-2xl border border-[#e9ecef] p-8"
        >
          <p className="text-[#495057]">No events are available right now. Check back soon.</p>
        </section>
      ) : (
        <section aria-label="Public events" className="grid gap-4 md:grid-cols-2">
          {eventList.data.map((event) => (
            <article key={event.id} className="rounded-2xl border border-[#e9ecef] p-6">
              <h2 className="text-2xl font-semibold text-[#1a1a2e]">{event.title}</h2>
              <p className="mt-2 text-[#495057]">{event.date}</p>
              {event.location ? <p className="mt-1 text-[#6c757d]">{event.location}</p> : null}
              <Link
                className="mt-4 inline-block rounded-full bg-[#1a1a2e] px-4 py-2 font-semibold text-white"
                href={`/events/${event.id}`}
              >
                View details
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
