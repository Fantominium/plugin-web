/**
 * Search service for event discovery
 * Handles searching, filtering, and managing search history
 */

import type { Event } from '@/app/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SEARCH_HISTORY_KEY = 'searchHistory';
const SEARCH_HISTORY_LIMIT = 10;

// Debounce helper
let debounceTimer: NodeJS.Timeout;

function debounce<TArgs extends unknown[], TResult>(
  func: (...args: TArgs) => Promise<TResult>,
  delay: number,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    clearTimeout(debounceTimer);
    return new Promise<TResult>((resolve) => {
      debounceTimer = setTimeout(async () => {
        resolve(await func(...args));
      }, delay);
    });
  };
}

/**
 * Search events with keyword and optional filters
 * Includes debouncing to prevent excessive API calls
 */
export const searchEvents = debounce(
  async (
    keyword: string,
    filters?: {
      category?: string;
      location?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ): Promise<Event[]> => {
    try {
      const params = new URLSearchParams({ q: keyword.toLowerCase() });
      if (filters?.category) params.append('category', filters.category);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));

      const response = await fetch(`${API_URL}/events/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
  250,
); // Debounce by 250ms

/**
 * Get search suggestions based on partial keyword
 * Includes recent searches and venue suggestions
 */
export async function getSearchSuggestions(keyword: string): Promise<string[]> {
  if (!keyword.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({ q: keyword.toLowerCase() });
    const response = await fetch(`${API_URL}/events/suggestions?${params.toString()}`);

    if (!response.ok) throw new Error('Failed to fetch suggestions');
    const suggestions = await response.json();

    // Merge API suggestions with recent searches
    const recentSearches = getSearchHistory().filter((item) =>
      item.toLowerCase().includes(keyword.toLowerCase()),
    );

    const allSuggestions = [...new Set([...recentSearches, ...(suggestions || [])])];

    return allSuggestions.slice(0, 10);
  } catch {
    // Fallback to recent searches only
    return getSearchHistory()
      .filter((item) => item.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 10);
  }
}

/**
 * Save search term to local storage history
 * Maintains most recent searches, prevents duplicates
 */
export function saveSearchToHistory(searchTerm: string): void {
  const trimmed = searchTerm.trim();
  if (!trimmed) return;

  let history: string[] = [];
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    history = stored ? JSON.parse(stored) : [];
  } catch {
    history = [];
  }

  // Remove duplicate if it exists
  history = history.filter((item) => item !== trimmed);

  // Add to beginning (most recent)
  history.unshift(trimmed);

  // Limit to SEARCH_HISTORY_LIMIT
  history = history.slice(0, SEARCH_HISTORY_LIMIT);

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

/**
 * Get search history from local storage
 */
export function getSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}
