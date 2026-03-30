import Link from 'next/link';
import EventDetails from '@/app/components/EventDetails/EventDetails';
import { fetchEventById } from '@/app/lib/event-service';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';

interface EventModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Modal page for event details using Next.js Parallel Routes
 * This intercepts /events/[id] navigation and displays as a modal overlay
 */
export default async function EventModalPage({ params }: EventModalPageProps) {
  const { id } = await params;
  const event = await fetchEventById(id).catch((error) => {
    console.error(`Failed to load event ${id}:`, error);
    return null;
  });

  if (!event) {
    return (
      <dialog
        open
        aria-modal="true"
        aria-label="Event unavailable"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#1a1a2e]">Event Not Found</h2>
          <p className="mt-3 text-[#495057]">We couldn&apos;t load the details for this event.</p>
          <Link
            href={PUBLIC_ROUTES.events}
            className="mt-6 inline-block rounded-full bg-[#1a1a2e] px-5 py-2 font-semibold text-white"
          >
            Back to Events
          </Link>
        </div>
      </dialog>
    );
  }

  return <EventDetails event={event} />;
}
