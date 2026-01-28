/**
 * API service for fetching event details
 * This is a placeholder that will connect to your backend API
 */

import { Event } from '@/app/types/event';

/**
 * Fetch event details by ID
 * Currently returns mock data; will be replaced with actual API call
 */
export async function fetchEventById(eventId: string | number): Promise<Event> {
  // Future API implementation:
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`);
  // if (!response.ok) throw new Error('Failed to fetch event');
  // const data = await response.json();
  // return data;

  // Mock data for development
  const mockEvents: Record<number, Event> = {
    1: {
      id: 1,
      title: 'Concert Night',
      date: 'Feb 15, 2026',
      category: 'Concerts',
      location: 'Bridgetown Concert Hall, Bridgetown',
      startTime: '7:00 PM',
      ticketPrice: '$35.00',
      description: 'Experience an unforgettable evening of live music featuring local and international artists. Join us for a night of incredible performances in an intimate setting.',
      image: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    2: {
      id: 2,
      title: 'Sports Championship',
      date: 'Feb 20, 2026',
      category: 'Sports',
      location: 'National Stadium, Bridgetown',
      startTime: '2:00 PM',
      ticketPrice: '$25.00',
      description: 'Watch the most exciting sports championship of the season. Featuring top athletes competing for glory. Bring your friends and family for an action-packed day!',
      image: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    3: {
      id: 3,
      title: 'Art Exhibition',
      date: 'Feb 25, 2026',
      category: 'Art',
      location: 'National Museum, St. Michael',
      startTime: '10:00 AM',
      ticketPrice: '$15.00',
      description: 'Explore contemporary and traditional art from talented local artists. This exhibition showcases diverse mediums and perspectives celebrating Barbadian culture.',
      image: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    4: {
      id: 4,
      title: 'Food Festival',
      date: 'Mar 5, 2026',
      category: 'Food',
      location: 'Garrison Historic Area, St. Michael',
      startTime: '11:00 AM',
      ticketPrice: 'Free Entry',
      description: 'Celebrate culinary excellence with tastings from the island\'s best restaurants and food vendors. Live cooking demonstrations and cultural performances throughout the day.',
      image: 'linear-gradient(135deg, #fa709a, #fee140)',
    },
  };

  const eventId_num = Number(eventId);
  const event = mockEvents[eventId_num];

  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  return event;
}
