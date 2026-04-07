import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { PublicEventSummary } from '@/app/types/public-content';
import FeaturedEvents from './FeaturedEvents';

const sampleEvents: PublicEventSummary[] = [
  {
    id: '1',
    title: 'Concert Night',
    category: 'Concerts',
    dateLabel: 'Feb 15',
    locationLabel: 'Bridgetown Concert Hall',
    detailHref: '/events/1',
    imageAlt: 'Concert Night event',
  },
  {
    id: '2',
    title: 'Art Exhibition',
    category: 'Art',
    dateLabel: 'Feb 25',
    locationLabel: 'National Museum',
    detailHref: '/events/2',
    imageAlt: 'Art Exhibition event',
  },
];

describe('FeaturedEvents', () => {
  describe('with events available', () => {
    it('renders the section with the Featured Events heading', () => {
      // Arrange & Act
      render(<FeaturedEvents events={sampleEvents} />);

      // Assert
      expect(screen.getByRole('heading', { name: /featured events/i })).toBeInTheDocument();
    });

    it('renders an event card for each provided event', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.getByText('Concert Night')).toBeInTheDocument();
      expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
    });

    it('renders the date label for each event', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.getByText('Feb 15')).toBeInTheDocument();
      expect(screen.getByText('Feb 25')).toBeInTheDocument();
    });

    it('renders the location label when provided', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.getByText('Bridgetown Concert Hall')).toBeInTheDocument();
    });

    it('renders each event card as a link to its detail route', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      const concertLink = screen.getByRole('link', { name: /concert night/i });
      expect(concertLink).toHaveAttribute('href', '/events/1');

      const artLink = screen.getByRole('link', { name: /art exhibition/i });
      expect(artLink).toHaveAttribute('href', '/events/2');
    });

    it('renders the category badge for each event', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.getByText('Concerts')).toBeInTheDocument();
      expect(screen.getByText('Art')).toBeInTheDocument();
    });

    it('does not render the empty-state message when events are present', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.queryByText(/no featured events/i)).not.toBeInTheDocument();
    });

    it('does not render the fallback CTA when events are present', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      expect(screen.queryByRole('link', { name: /browse all events/i })).not.toBeInTheDocument();
    });
  });

  describe('with no events (empty state — FR-028A)', () => {
    it('keeps the section visible with the Featured Events heading (FR-028A)', () => {
      // Arrange & Act
      render(<FeaturedEvents events={[]} />);

      // Assert — the section must remain in DOM, not be hidden (FR-028A)
      expect(screen.getByRole('heading', { name: /featured events/i })).toBeInTheDocument();
    });

    it('renders the empty-state message (FR-028A)', () => {
      render(<FeaturedEvents events={[]} />);

      // The message communicates that events are temporarily unavailable
      expect(screen.getByText(/no featured events are available/i)).toBeInTheDocument();
    });

    it('renders a fallback CTA linking to /events (FR-028A)', () => {
      render(<FeaturedEvents events={[]} />);

      // The fallback action must route to /events, not a dead end
      const cta = screen.getByRole('link', { name: /browse all events/i });
      expect(cta).toHaveAttribute('href', '/events');
    });

    it('does not render individual event cards when events array is empty', () => {
      render(<FeaturedEvents events={[]} />);

      expect(screen.queryByText('Concert Night')).not.toBeInTheDocument();
    });

    it('renders the empty state correctly for a single-event removal', () => {
      // Edge case: empty array after removing the last event
      render(<FeaturedEvents events={[]} />);

      // Both the message and CTA appear
      expect(screen.getByText(/no featured events are available/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /browse all events/i })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('section has an accessible name via the heading (landmark check)', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      // <section aria-labelledby="..."> gives it role="region" with a computed name
      const region = screen.getByRole('region', { name: /featured events/i });
      expect(region).toBeInTheDocument();
    });

    it('event detail links have accessible names derived from event titles', () => {
      render(<FeaturedEvents events={sampleEvents} />);

      // Links must communicate destination purpose before activation
      const links = screen.getAllByRole('link');
      const eventLinks = links.filter((l) => l.getAttribute('href')?.startsWith('/events/'));
      expect(eventLinks.length).toBe(sampleEvents.length);
      eventLinks.forEach((link) => {
        expect(link.textContent).toBeTruthy();
      });
    });
  });
});
