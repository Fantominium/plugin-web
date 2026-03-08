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
  endTime?: string;
  ticketPrice?: number | string;
  description?: string;
  image?: string;
  venue?: string;
  capacity?: number;
  attendees?: number;
  rating?: number;
  reviewCount?: number;
  organizerId?: string;
  organizerName?: string;
  isFeatured?: boolean;
  tags?: string[];
}

/**
 * Ticket information for an event
 */
export interface Ticket {
  id: string;
  eventId: number;
  type: string;
  price: number;
  quantity: number;
  availableQuantity: number;
}

/**
 * Review/Rating for an event
 */
export interface EventReview {
  id: string;
  eventId: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/**
 * API response for event details
 */
export interface EventDetailsResponse {
  success: boolean;
  data: Event;
  error?: string;
}

/**
 * Event list response with pagination
 */
export interface EventListResponse {
  success: boolean;
  data: Event[];
  total: number;
  page: number;
  limit: number;
  error?: string;
}

/**
 * Filter options for event queries
 */
export interface EventFilters {
  category?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
