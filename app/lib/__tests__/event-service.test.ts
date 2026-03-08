import {
  fetchEventById,
  fetchEventList,
  fetchEventsByCategory,
  fetchEventsByDateRange,
  fetchEventsByLocation,
  fetchEventsByMultipleFilters,
} from '../event-service';
import { Event } from '@/app/types/event';

// Mock fetch
global.fetch = jest.fn();

describe('Event Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchEventById', () => {
    it('should fetch a single event by ID', async () => {
      const mockEvent: Event = {
        id: 1,
        title: 'Concert Night',
        date: 'Feb 15, 2026',
        category: 'Concerts',
        location: 'Bridgetown Concert Hall',
        startTime: '7:00 PM',
        ticketPrice: 35,
        description: 'A great concert',
        image: 'linear-gradient(135deg, #667eea, #764ba2)',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });

      const result = await fetchEventById(1);

      expect(result).toEqual(mockEvent);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/events/1'));
    });

    it('should fallback to mock data when API returns error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchEventById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should fallback to mock data on network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchEventById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should return mock data when API is not available', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API unavailable'));

      // Should fallback to mock data, not throw
      const result = await fetchEventById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });
  });

  describe('fetchEventList', () => {
    it('should fetch list of events without filters', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Event 1', date: 'Feb 15, 2026', category: 'Concerts' },
        { id: 2, title: 'Event 2', date: 'Feb 20, 2026', category: 'Sports' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockEvents, total: 2, page: 1, limit: 20 }),
      });

      const result = await fetchEventList();

      expect(result.data).toEqual(mockEvents);
      expect(result.total).toBe(2);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should support pagination parameters', async () => {
      const mockEvents: Event[] = [
        { id: 3, title: 'Event 3', date: 'Feb 25, 2026', category: 'Art' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockEvents, total: 50, page: 2, limit: 20 }),
      });

      const result = await fetchEventList({ page: 2, limit: 20 });

      expect(result.page).toBe(2);
      expect(result.total).toBe(50);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
    });

    it('should return empty array when no events found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 20 }),
      });

      const result = await fetchEventList();

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should support filtering by category', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Concert', date: 'Feb 15, 2026', category: 'Concerts' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockEvents, total: 1 }),
      });

      await fetchEventList({ category: 'Concerts' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Concerts')
      );
    });
  });

  describe('fetchEventsByCategory', () => {
    it('should fetch events by category', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Concert 1', category: 'Concerts' },
        { id: 2, title: 'Concert 2', category: 'Concerts' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await fetchEventsByCategory('Concerts');

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('Concerts');
    });

    it('should return empty array for category with no events', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await fetchEventsByCategory('NonExistent');

      expect(result).toEqual([]);
    });
  });

  describe('fetchEventsByDateRange', () => {
    it('should fetch events within date range', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Event 1', date: 'Feb 15, 2026' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const startDate = new Date('2026-02-01');
      const endDate = new Date('2026-02-28');

      const result = await fetchEventsByDateRange(startDate, endDate);

      expect(result).toEqual(mockEvents);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/startDate=.*&endDate=/)
      );
    });
  });

  describe('fetchEventsByLocation', () => {
    it('should fetch events by location', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Event 1', location: 'Bridgetown Concert Hall' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await fetchEventsByLocation('Bridgetown');

      expect(result).toEqual(mockEvents);
    });

    it('should fetch events within radius from coordinates', async () => {
      const mockEvents: Event[] = [
        { id: 1, title: 'Event 1', location: 'Near you' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await fetchEventsByLocation('Bridgetown', {
        latitude: 13.1939,
        longitude: -59.5432,
        radiusKm: 10,
      });

      expect(result).toEqual(mockEvents);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/latitude=|longitude=|radius=/)
      );
    });
  });

  describe('fetchEventsByMultipleFilters', () => {
    it('should fetch events with multiple filters applied', async () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Concert',
          date: 'Feb 15, 2026',
          category: 'Concerts',
          location: 'Bridgetown',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockEvents, total: 1, page: 1, limit: 20 }),
      });

      const result = await fetchEventsByMultipleFilters({
        category: 'Concerts',
        location: 'Bridgetown',
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual(mockEvents);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/category=Concerts/)
      );
    });

    it('should combine all filter types in single request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [], total: 0, page: 1, limit: 10 }),
      });

      const startDate = new Date('2026-02-01');
      const endDate = new Date('2026-02-28');

      await fetchEventsByMultipleFilters({
        category: 'Sports',
        location: 'Stadium',
        startDate,
        endDate,
        page: 1,
        limit: 10,
      });

      expect(global.fetch).toHaveBeenCalled();
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toMatch(/category=/);
      expect(callUrl).toMatch(/location=/);
    });
  });
});
