import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('should render search input with placeholder', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText(/search events/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render search button', () => {
    render(<SearchBar />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText(/search events/i);
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('should render with proper styling class', () => {
    const { container } = render(<SearchBar />);
    const searchContainer = container.querySelector('.search-bar');
    expect(searchContainer).toBeInTheDocument();
  });
});
