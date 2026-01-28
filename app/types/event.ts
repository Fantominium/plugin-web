/**
 * Event data structure for featured events
 * This type will be populated from the API in the future
 */
export interface Event {
  id: number;
  title: string;
  date: string;
  category: string;
  location?: string;
  startTime?: string;
  ticketPrice?: number | string;
  description?: string;
  image?: string;
}

/**
 * API response for event details
 */
export interface EventDetailsResponse {
  success: boolean;
  data: Event;
  error?: string;
}
