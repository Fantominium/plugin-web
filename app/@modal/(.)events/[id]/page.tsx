import React from 'react';
import EventDetails from '@/app/components/EventDetails/EventDetails';
import { fetchEventById } from '@/app/lib/event-service';

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
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <h2>Event Not Found</h2>
          <p>We couldn&apos;t load the details for this event.</p>
        </div>
      </dialog>
    );
  }

  return <EventDetails event={event} />;
}
