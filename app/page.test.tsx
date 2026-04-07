import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { fetchEventList } from '@/app/lib/event-service';
import type { EventListResponse } from '@/app/types/event';
import Page from './page';

jest.mock('@/app/lib/event-service');

const mockFetchEventList = fetchEventList as jest.MockedFunction<typeof fetchEventList>;

const stubEventListResponse = (overrides: Partial<EventListResponse> = {}): EventListResponse => ({
  success: true,
  data: [
    { id: 1, title: 'Concert Night', date: 'Feb 15', category: 'Concerts', location: 'Bridgetown' },
    { id: 2, title: 'Art Exhibition', date: 'Feb 25', category: 'Art', location: 'St. Michael' },
  ],
  total: 2,
  page: 1,
  limit: 4,
  ...overrides,
});

describe('Homepage', () => {
  beforeEach(() => {
    mockFetchEventList.mockResolvedValue(stubEventListResponse());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Product story and structure', () => {
    it('renders the product story heading as an h1 (FR-001)', async () => {
      // Arrange & Act
      render(await Page());

      // Assert — the primary heading communicates the product purpose
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/discover events/i);
    });

    it('renders a primary discovery CTA linking to /events (FR-002)', async () => {
      render(await Page());

      const browseLink = screen.getByRole('link', { name: /browse events/i });
      expect(browseLink).toHaveAttribute('href', '/events');
    });

    it('renders a Contact Us CTA linking to /contact-us (FR-003)', async () => {
      render(await Page());

      const contactLink = screen.getByRole('link', { name: /contact us/i });
      expect(contactLink).toHaveAttribute('href', '/contact-us');
    });
  });

  describe('Section composition', () => {
    it('renders the featured events section (FR-002)', async () => {
      render(await Page());

      // The section has an accessible heading "Featured Events"
      expect(screen.getByRole('heading', { name: /featured events/i })).toBeInTheDocument();
    });

    it('renders the categories discovery section (FR-002)', async () => {
      render(await Page());

      expect(screen.getByRole('heading', { name: /browse by category/i })).toBeInTheDocument();
    });

    it('renders the app promotion section (FR-002)', async () => {
      render(await Page());

      expect(
        screen.getByRole('heading', { name: /your barbados event companion/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Featured events with data', () => {
    it('renders event titles when events are returned by the service', async () => {
      render(await Page());

      expect(screen.getByText('Concert Night')).toBeInTheDocument();
      expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
    });

    it('renders event detail links for each event', async () => {
      render(await Page());

      const concertLink = screen.getByRole('link', { name: /concert night/i });
      expect(concertLink).toHaveAttribute('href', '/events/1');
    });
  });

  describe('Featured events empty state (FR-028A)', () => {
    it('shows the empty-state message when no events are returned', async () => {
      // Arrange — service returns zero events
      mockFetchEventList.mockResolvedValue(stubEventListResponse({ data: [], total: 0 }));

      // Act
      render(await Page());

      // Assert — section stays visible with a clear message (FR-028A)
      expect(screen.getByText(/no featured events are available/i)).toBeInTheDocument();
    });

    it('renders a fallback CTA to /events when no events are returned (FR-028A)', async () => {
      // Arrange
      mockFetchEventList.mockResolvedValue(stubEventListResponse({ data: [], total: 0 }));

      // Act
      render(await Page());

      // Assert — fallback CTA links to the main events page, not a dead end
      const fallbackLink = screen.getByRole('link', { name: /browse all events/i });
      expect(fallbackLink).toHaveAttribute('href', '/events');
    });

    it('keeps the featured events section visible in empty state (FR-028A)', async () => {
      // Arrange
      mockFetchEventList.mockResolvedValue(stubEventListResponse({ data: [], total: 0 }));

      // Act
      render(await Page());

      // Assert — the section heading remains in the DOM; the section is not hidden
      expect(screen.getByRole('heading', { name: /featured events/i })).toBeInTheDocument();
    });

    it('shows the empty state when the event service throws an error', async () => {
      // Arrange — simulate service failure
      mockFetchEventList.mockRejectedValue(new Error('Service unavailable'));

      // Act
      render(await Page());

      // Assert — graceful degradation to empty state, no crash
      const fallbackLink = screen.getByRole('link', { name: /browse all events/i });
      expect(fallbackLink).toHaveAttribute('href', '/events');
    });
  });
});
