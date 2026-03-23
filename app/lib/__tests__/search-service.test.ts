import type { Event } from '@/app/types/event';
import {
  clearSearchHistory,
  getSearchHistory,
  getSearchSuggestions,
  saveSearchToHistory,
  searchEvents,
} from '../search-service';

global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Search Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('searchEvents', () => {
    it('should search events with keyword', async () => {
      const mockResults: Event[] = [
        { id: 1, title: 'Concert Night', date: 'Feb 15, 2026', category: 'Concerts' },
        { id: 2, title: 'Concert Series', date: 'Feb 16, 2026', category: 'Concerts' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const result = await searchEvents('Concert');

      expect(result).toEqual(mockResults);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/search.*concert/));
    });

    it('should return empty array for no matches', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await searchEvents('NonexistentEvent');

      expect(result).toEqual([]);
    });

    it('should respect filters in search', async () => {
      const mockResults: Event[] = [
        { id: 1, title: 'Concert', date: 'Feb 15, 2026', category: 'Concerts' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      await searchEvents('Concert', {
        category: 'Concerts',
        location: 'Bridgetown',
      });

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toMatch(/Concert/);
      expect(callUrl).toMatch(/category=Concerts/);
      expect(callUrl).toMatch(/location=Bridgetown/);
    });

    it('should be case-insensitive', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: 'Concert', date: 'Feb 15, 2026', category: 'Concerts' }],
      });

      await searchEvents('CONCERT');

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle special characters in search', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await searchEvents('Music & Arts Festival');

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should debounce rapid search calls', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      // Make 3 rapid calls
      searchEvents('concert');
      searchEvents('concert');
      searchEvents('concert');

      // Debounced function should only call fetch once after delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return event suggestions for partial keyword', async () => {
      const mockSuggestions = ['Concert Night', 'Concert Series', 'Concert Festival'];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      });

      const result = await getSearchSuggestions('con');

      expect(result).toContain('Concert Night');
      expect(result).toHaveLength(3);
    });

    it('should include recent searches in suggestions', async () => {
      // Add some items to search history
      localStorage.setItem('searchHistory', JSON.stringify(['Concert', 'Sports Event']));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ['Concert Series'],
      });

      const result = await getSearchSuggestions('con');

      expect(result).toContain('Concert');
    });

    it('should return suggestions for venues', async () => {
      const mockSuggestions = ['Bridgetown Concert Hall', 'National Stadium'];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      });

      const result = await getSearchSuggestions('bridge');

      expect(result).toContain('Bridgetown Concert Hall');
    });

    it('should return empty array for empty query', async () => {
      const result = await getSearchSuggestions('');

      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('saveSearchToHistory', () => {
    it('should save search term to local storage', () => {
      saveSearchToHistory('Concert');

      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(history).toContain('Concert');
    });

    it('should limit history to last 10 searches', () => {
      for (let i = 0; i < 15; i++) {
        saveSearchToHistory(`Search ${i}`);
      }

      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(history.length).toBeLessThanOrEqual(10);
    });

    it('should not save duplicate consecutive searches', () => {
      saveSearchToHistory('Concert');
      saveSearchToHistory('Concert');
      saveSearchToHistory('Concert');

      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const concertCount = history.filter((item: string) => item === 'Concert').length;
      expect(concertCount).toBe(1);
    });

    it('should move duplicate search to top of list', () => {
      saveSearchToHistory('Concert');
      saveSearchToHistory('Sports');
      saveSearchToHistory('Concert');

      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(history[0]).toBe('Concert');
    });

    it('should trim whitespace from search term', () => {
      saveSearchToHistory('  Concert  ');

      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      expect(history[0]).toBe('Concert');
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history from local storage', () => {
      const history = ['Concert', 'Sports', 'Art Exhibition'];
      localStorage.setItem('searchHistory', JSON.stringify(history));

      const result = getSearchHistory();

      expect(result).toEqual(history);
    });

    it('should return empty array if no history exists', () => {
      const result = getSearchHistory();

      expect(result).toEqual([]);
    });

    it('should return history in correct order (most recent first)', () => {
      saveSearchToHistory('Concert');
      saveSearchToHistory('Sports');

      const history = getSearchHistory();

      expect(history[0]).toBe('Sports');
      expect(history[history.length - 1]).toBe('Concert');
    });
  });

  describe('clearSearchHistory', () => {
    it('should clear all search history', () => {
      localStorage.setItem('searchHistory', JSON.stringify(['Concert', 'Sports']));

      clearSearchHistory();

      const history = getSearchHistory();
      expect(history).toEqual([]);
    });

    it('should remove searchHistory from localStorage', () => {
      localStorage.setItem('searchHistory', JSON.stringify(['Concert']));

      clearSearchHistory();

      expect(localStorage.getItem('searchHistory')).toBeNull();
    });
  });
});
