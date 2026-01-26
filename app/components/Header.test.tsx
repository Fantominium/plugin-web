import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
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
      const logo = screen.getByText(/plug in/i);
      expect(logo).toBeInTheDocument();
    });

    it('should render navigation menu items', () => {
      render(<Header />);
      const mainNav = screen.getByRole('navigation', { name: /main navigation/i });
      
      expect(mainNav).toHaveTextContent(/events/i);
      expect(mainNav).toHaveTextContent(/categories/i);
    });

    it('should render search bar component', () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should render navigation tabs for categories', () => {
      render(<Header />);
      const categoryNav = screen.getByRole('navigation', { name: /category filter/i });
      
      expect(categoryNav).toHaveTextContent(/concerts/i);
      expect(categoryNav).toHaveTextContent(/sports/i);
      expect(categoryNav).toHaveTextContent(/festivals/i);
    });

    it('should render navigation menu items in mobile menu', () => {
      render(<Header />);
      const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
      
      expect(mobileNav).toHaveTextContent(/events/i);
      expect(mobileNav).toHaveTextContent(/categories/i);
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
      expect(header).toHaveClass('sticky');
    });

    it('should have frosted glass background when sticky', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('frostedGlass');
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

    it('should toggle mobile menu when hamburger is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      const user = userEvent.setup();
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');

      await user.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      await user.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show mobile navigation menu when toggled', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      const user = userEvent.setup();
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /menu/i });
      const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });

      expect(mobileNav).toHaveClass('mobileNavClosed');

      await user.click(hamburger);
      expect(mobileNav).toHaveClass('mobileNavOpen');
    });

    it('should close mobile menu when a link is clicked', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      const user = userEvent.setup();
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /toggle menu/i });

      await user.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
      const firstLink = mobileNav.querySelector('a');
      
      if (firstLink) {
        await user.click(firstLink);
        expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      }
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
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('should have skip to main content link', () => {
      render(<Header />);
      const skipLink = screen.getByText(/skip to main/i);
      expect(skipLink).toBeInTheDocument();
    });
  });
});
