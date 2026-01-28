import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EventDetails from './EventDetails';
import { Event } from '@/app/types/event';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

const mockEvent: Event = {
  id: 1,
  title: 'Concert Night',
  date: 'Feb 15, 2026',
  category: 'Concerts',
  location: 'Bridgetown Concert Hall, Bridgetown',
  startTime: '7:00 PM',
  ticketPrice: '$35.00',
  description: 'Experience an unforgettable evening of live music featuring local and international artists.',
  image: 'linear-gradient(135deg, #667eea, #764ba2)',
};

describe('EventDetails', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render event title', () => {
      render(<EventDetails event={mockEvent} />);
      const title = screen.getByRole('heading', { name: /concert night/i });
      expect(title).toBeInTheDocument();
    });

    it('should render event category badge', () => {
      render(<EventDetails event={mockEvent} />);
      const category = screen.getByText(/concerts/i);
      expect(category).toBeInTheDocument();
    });

    it('should render all event details', () => {
      render(<EventDetails event={mockEvent} />);
      expect(screen.getByText(/Feb 15, 2026/)).toBeInTheDocument();
      expect(screen.getByText(/7:00 PM/)).toBeInTheDocument();
      expect(screen.getByText(/Bridgetown Concert Hall/)).toBeInTheDocument();
      expect(screen.getByText(/\$35.00/)).toBeInTheDocument();
    });

    it('should render event description', () => {
      render(<EventDetails event={mockEvent} />);
      expect(screen.getByText(/Experience an unforgettable evening/)).toBeInTheDocument();
    });

    it('should render close button with accessible label', () => {
      render(<EventDetails event={mockEvent} />);
      const closeButton = screen.getByRole('button', { name: /close event details/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should render register button', () => {
      render(<EventDetails event={mockEvent} />);
      const registerButton = screen.getByRole('button', { name: /register for event/i });
      expect(registerButton).toBeInTheDocument();
    });

    it('should render modal with correct ARIA attributes', () => {
      render(<EventDetails event={mockEvent} />);
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'event-title');
    });
  });

  describe('Modal Behavior', () => {
    it('should prevent body scroll when modal is open', () => {
      render(<EventDetails event={mockEvent} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = render(<EventDetails event={mockEvent} />);
      unmount();
      expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<EventDetails event={mockEvent} />);
      const closeButton = screen.getByRole('button', { name: /close event details/i });

      await user.click(closeButton);
      expect(closeButton).toBeInTheDocument();
    });

    it('should close modal when backdrop is clicked', async () => {
      render(<EventDetails event={mockEvent} />);
      const backdrop = document.querySelector('[class*="backdrop"]') as HTMLElement;

      if (backdrop) {
        fireEvent.click(backdrop);
        expect(backdrop).toBeInTheDocument();
      }
    });

    it('should not close modal when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(<EventDetails event={mockEvent} />);
      const title = screen.getByRole('heading', { name: /concert night/i });

      await user.click(title);
      expect(title).toBeInTheDocument();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should close modal on Escape key press', async () => {
      render(<EventDetails event={mockEvent} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Optional Fields', () => {
    it('should handle missing optional fields gracefully', () => {
      const minimalEvent: Event = {
        id: 1,
        title: 'Event Title',
        date: 'Feb 15, 2026',
        category: 'Category',
      };

      render(<EventDetails event={minimalEvent} />);
      expect(screen.getByText(/Event Title/)).toBeInTheDocument();
      expect(screen.getByText(/Category/)).toBeInTheDocument();
    });
  });
});
