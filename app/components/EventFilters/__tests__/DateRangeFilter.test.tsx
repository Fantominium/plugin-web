import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangeFilter from '../DateRangeFilter';

describe('DateRangeFilter Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render start and end date inputs', () => {
    render(<DateRangeFilter onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('should call onChange when start date changes', async () => {
    const user = userEvent.setup();
    render(<DateRangeFilter onChange={mockOnChange} />);

    const startInput = screen.getByLabelText(/start date/i);
    await user.type(startInput, '2026-02-15');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should call onChange when end date changes', async () => {
    const user = userEvent.setup();
    render(<DateRangeFilter onChange={mockOnChange} />);

    const endInput = screen.getByLabelText(/end date/i);
    await user.type(endInput, '2026-03-15');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should validate that end date is after start date', async () => {
    const user = userEvent.setup();
    render(<DateRangeFilter onChange={mockOnChange} />);

    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);

    await user.type(startInput, '2026-03-15');
    await user.type(endInput, '2026-02-15');

    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });
  });

  it('should render preset date range buttons', () => {
    render(<DateRangeFilter onChange={mockOnChange} showPresets={true} />);

    expect(screen.getByRole('button', { name: /this weekend/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /this month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next 30 days/i })).toBeInTheDocument();
  });

  it('should apply preset date ranges', async () => {
    const user = userEvent.setup();
    render(<DateRangeFilter onChange={mockOnChange} showPresets={true} />);

    const thisMonthButton = screen.getByRole('button', { name: /this month/i });
    await user.click(thisMonthButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('should allow clearing date range', async () => {
    const user = userEvent.setup();
    render(
      <DateRangeFilter
        onChange={mockOnChange}
        startDate={new Date('2026-02-15')}
        endDate={new Date('2026-03-15')}
      />,
    );

    const clearButton = screen.getByRole('button', { name: /clear dates/i });
    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith({ startDate: null, endDate: null });
  });
});
