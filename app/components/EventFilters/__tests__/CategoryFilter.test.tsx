import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter Component', () => {
  const mockCategories = [
    'Concerts',
    'Sports',
    'Art',
    'Food',
    'Theater',
    'Comedy',
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all categories', () => {
    render(
      <CategoryFilter categories={mockCategories} onChange={mockOnChange} />
    );

    mockCategories.forEach(cat => {
      expect(screen.getByLabelText(cat)).toBeInTheDocument();
    });
  });

  it('should render with accessibility labels', () => {
    render(
      <CategoryFilter categories={mockCategories} onChange={mockOnChange} />
    );

    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
  });

  it('should call onChange when category is selected', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter categories={mockCategories} onChange={mockOnChange} />
    );

    const concertCheckbox = screen.getByLabelText('Concerts');
    await user.click(concertCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(['Concerts']);
  });

  it('should handle multiple selections', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter categories={mockCategories} onChange={mockOnChange} />
    );

    const concertCheckbox = screen.getByLabelText('Concerts');
    const sportsCheckbox = screen.getByLabelText('Sports');

    await user.click(concertCheckbox);
    await user.click(sportsCheckbox);

    expect(mockOnChange).toHaveBeenLastCalledWith(['Concerts', 'Sports']);
  });

  it('should deselect category when clicked again', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter
        categories={mockCategories}
        onChange={mockOnChange}
        selectedCategories={['Concerts']}
      />
    );

    const concertCheckbox = screen.getByLabelText('Concerts');
    await user.click(concertCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('should display category count', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        onChange={mockOnChange}
        showCount={true}
        categoryCount={{ Concerts: 15, Sports: 23, Art: 8, Food: 42, Theater: 5, Comedy: 10 }}
      />
    );

    expect(screen.getByText(/Concerts/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should allow clearing all selections', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CategoryFilter
        categories={mockCategories}
        onChange={mockOnChange}
        selectedCategories={['Concerts', 'Sports']}
        onClear={jest.fn()}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});
