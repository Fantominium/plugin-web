import { isValidLocationId } from '@/app/config/locations';
import { isNonEmptyString, isValidIsoDate, isValidUrl } from '@/app/lib/validation/common';

export interface EventValidationInput {
  emailAddress: string;
  eventName: string;
  description: string;
  startAt: string;
  endAt: string;
  locationId: string;
  ticketUrl?: string;
  registrationUrl?: string;
  socialUrl?: string;
}

export function validateEventInput(input: EventValidationInput): string[] {
  const errors: string[] = [];

  if (!isNonEmptyString(input.emailAddress)) {
    errors.push('Email address is required');
  }

  if (!isNonEmptyString(input.eventName)) {
    errors.push('Event name is required');
  }

  if (!isNonEmptyString(input.description)) {
    errors.push('Description is required');
  }

  if (!isValidIsoDate(input.startAt) || !isValidIsoDate(input.endAt)) {
    errors.push('Start and end date must be valid ISO timestamps');
  } else if (new Date(input.endAt) < new Date(input.startAt)) {
    errors.push('End date must be after start date');
  }

  if (!isValidLocationId(input.locationId)) {
    errors.push('Invalid location selected');
  }

  if (input.ticketUrl && !isValidUrl(input.ticketUrl)) {
    errors.push('Ticket URL must be valid');
  }

  if (input.registrationUrl && !isValidUrl(input.registrationUrl)) {
    errors.push('Registration URL must be valid');
  }

  if (input.socialUrl && !isValidUrl(input.socialUrl)) {
    errors.push('Social URL must be valid');
  }

  return errors;
}
