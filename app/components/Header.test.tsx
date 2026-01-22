import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  beforeEach(() => {
    // Reset window scroll position before each test
    window.scrollY = 0;
  });

  describe('Rendering', () => {
    it('should render the header element', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render the logo', () => {
      render(<Header />);
      const logo = screen.getByAltText(/plug in/i);
      expect(logo).toBeInTheDocument();
    });

    it('should render navigation menu items', () => {
      render(<Header />);
      expect(screen.getByText(/events/i)).toBeInTheDocument();
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
    });

    it('should render search bar component', () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should render navigation tabs for categories', () => {
      render(<Header />);
      expect(screen.getByText(/concerts/i)).toBeInTheDocument();
      expect(screen.getByText(/sports/i)).toBeInTheDocument();
      expect(screen.getByText(/festivals/i)).toBeInTheDocument();
    });
  });

  describe('Sticky Behavior', () => {
    it('should have sticky positioning from page load', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky');
    });

    it('should apply reduced height styling when sticky', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky-reduced');
    });

    it('should have frosted glass background when sticky', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('frosted-glass');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render hamburger menu on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });
      expect(hamburger).toBeInTheDocument();
    });

    it('should toggle mobile menu when hamburger is clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show mobile navigation menu when toggled', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });
      const mobileNav = screen.getByRole('navigation', { hidden: true });

      expect(mobileNav).toHaveClass('mobile-nav-closed');

      fireEvent.click(hamburger);
      expect(mobileNav).toHaveClass('mobile-nav-open');
    });

    it('should close mobile menu when a link is clicked', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });

      fireEvent.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      const firstLink = screen.getAllByRole('link')[0];
      fireEvent.click(firstLink);

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have semantic navigation element', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have skip to main content link', () => {
      render(<Header />);
      const skipLink = screen.getByText(/skip to main/i);
      expect(skipLink).toBeInTheDocument();
    });
  });
});
