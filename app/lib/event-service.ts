/**
 * API service for fetching event details
 * This module handles all event-related API calls with fallback to mock data
 */

import { Event, EventListResponse, EventFilters } from '@/app/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Mock data for development and fallback
 */
const mockEvents: Record<number, Event> = {
  1: {
    id: 1,
    title: 'Concert Night',
    date: 'Feb 15, 2026',
    category: 'Concerts',
    location: 'Bridgetown Concert Hall, Bridgetown',
    startTime: '7:00 PM',
    ticketPrice: 35,
    description: 'Experience an unforgettable evening of live music featuring local and international artists. Join us for a night of incredible performances in an intimate setting.',
    image: 'linear-gradient(135deg, #667eea, #764ba2)',
    rating: 4.5,
    reviewCount: 127,
    capacity: 500,
    attendees: 450,
  },
  2: {
    id: 2,
    title: 'Sports Championship',
    date: 'Feb 20, 2026',
    category: 'Sports',
    location: 'National Stadium, Bridgetown',
    startTime: '2:00 PM',
    ticketPrice: 25,
    description: 'Watch the most exciting sports championship of the season. Featuring top athletes competing for glory. Bring your friends and family for an action-packed day!',
    image: 'linear-gradient(135deg, #f093fb, #f5576c)',
    rating: 4.8,
    reviewCount: 245,
    capacity: 10000,
    attendees: 8900,
  },
  3: {
    id: 3,
    title: 'Art Exhibition',
    date: 'Feb 25, 2026',
    category: 'Art',
    location: 'National Museum, St. Michael',
    startTime: '10:00 AM',
    ticketPrice: 15,
    description: 'Explore contemporary and traditional art from talented local artists. This exhibition showcases diverse mediums and perspectives celebrating Barbadian culture.',
    image: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    rating: 4.3,
    reviewCount: 89,
    capacity: 200,
    attendees: 180,
  },
  4: {
    id: 4,
    title: 'Food Festival',
    date: 'Mar 5, 2026',
    category: 'Food',
    location: 'Garrison Historic Area, St. Michael',
    startTime: '11:00 AM',
    ticketPrice: 0,
    description: 'Celebrate culinary excellence with tastings from the island\'s best restaurants and food vendors. Live cooking demonstrations and cultural performances throughout the day.',
    image: 'linear-gradient(135deg, #fa709a, #fee140)',
    rating: 4.6,
    reviewCount: 312,
    capacity: 5000,
    attendees: 4200,
  },
};

/**
 * Fetch event details by ID
 * Attempts API call first, falls back to mock data on error
 */
export async function fetchEventById(eventId: string | number): Promise<Event> {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return await response.json();
  } catch (error) {
    // Fallback to mock data
    const eventId_num = Number(eventId);
    const event = mockEvents[eventId_num];
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    return event;
  }
}

/**
 * Fetch list of events with optional filters and pagination
 */
export async function fetchEventList(
  options?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
  }
): Promise<EventListResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.category) params.append('category', options.category);
    if (options?.location) params.append('location', options.location);

    const url = `${API_URL}/events?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    // Fallback to mock data
    const allEvents = Object.values(mockEvents);
    let filteredEvents = allEvents;

    if (options?.category) {
      filteredEvents = filteredEvents.filter(e => e.category === options.category);
    }

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const start = (page - 1) * limit;
    const paginatedEvents = filteredEvents.slice(start, start + limit);

    return {
      success: true,
      data: paginatedEvents,
      total: filteredEvents.length,
      page,
      limit,
    };
  }
}

/**
 * Fetch events by category
 */
export async function fetchEventsByCategory(category: string): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/events?category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Fallback to mock data
    return Object.values(mockEvents).filter(e => e.category === category);
  }
}

/**
 * Fetch events within a date range
 */
export async function fetchEventsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetch(`${API_URL}/events?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Fallback to mock data
    return Object.values(mockEvents);
  }
}

/**
 * Fetch events by location
 */
export async function fetchEventsByLocation(
  location: string,
  options?: {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }
): Promise<Event[]> {
  try {
    const params = new URLSearchParams({ location });
    if (options?.latitude) params.append('latitude', String(options.latitude));
    if (options?.longitude) params.append('longitude', String(options.longitude));
    if (options?.radiusKm) params.append('radius', String(options.radiusKm));

    const response = await fetch(`${API_URL}/events?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Fallback to mock data
    return Object.values(mockEvents).filter(e =>
      e.location?.includes(location)
    );
  }
}

/**
 * Fetch events with multiple filters applied
 */
export async function fetchEventsByMultipleFilters(
  filters: EventFilters
): Promise<EventListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const url = `${API_URL}/events?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    // Fallback to mock data
    let filteredEvents = Object.values(mockEvents);

    if (filters.category) {
      filteredEvents = filteredEvents.filter(e => e.category === filters.category);
    }
    if (filters.location) {
      filteredEvents = filteredEvents.filter(e => e.location?.includes(filters.location!));
    }
    if (filters.minPrice !== undefined) {
      filteredEvents = filteredEvents.filter(
        e => typeof e.ticketPrice === 'number' && e.ticketPrice >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredEvents = filteredEvents.filter(
        e => typeof e.ticketPrice === 'number' && e.ticketPrice <= filters.maxPrice!
      );
    }

    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const start = (page - 1) * limit;
    const paginatedEvents = filteredEvents.slice(start, start + limit);

    return {
      success: true,
      data: paginatedEvents,
      total: filteredEvents.length,
      page,
      limit,
    };
  }
}
