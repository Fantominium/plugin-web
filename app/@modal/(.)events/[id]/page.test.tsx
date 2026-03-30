import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { fetchEventById } from '@/app/lib/event-service';
import Page from './page';

jest.mock('@/app/lib/event-service', () => ({
  fetchEventById: jest.fn(),
}));

jest.mock('@/app/components/EventDetails/EventDetails', () => ({
  __esModule: true,
  default: ({ event }: { event: { title: string } }) => (
    <div data-testid="event-details">{event.title}</div>
  ),
}));

const mockFetchEventById = fetchEventById as jest.MockedFunction<typeof fetchEventById>;

describe('Intercepted Event Modal Route', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('renders event details when event exists', async () => {
    mockFetchEventById.mockResolvedValue({
      id: 21,
      title: 'Jazz Under The Stars',
      date: '2026-06-10',
      category: 'Music',
      location: 'Bridgetown',
    });

    render(await Page({ params: Promise.resolve({ id: '21' }) }));

    expect(mockFetchEventById).toHaveBeenCalledWith('21');
    expect(screen.getByTestId('event-details')).toHaveTextContent('Jazz Under The Stars');
  });

  it('renders not-found fallback with navigation back to events', async () => {
    mockFetchEventById.mockRejectedValue(new Error('Event not found'));

    render(await Page({ params: Promise.resolve({ id: 'missing' }) }));

    expect(screen.getByRole('heading', { level: 2, name: /event not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to events/i })).toHaveAttribute(
      'href',
      '/events',
    );
  });

  it('fails closed to not-found fallback when fetch throws', async () => {
    mockFetchEventById.mockRejectedValue(new Error('service down'));

    render(await Page({ params: Promise.resolve({ id: 'error-case' }) }));

    expect(screen.getByRole('heading', { level: 2, name: /event not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to events/i })).toHaveAttribute(
      'href',
      '/events',
    );
  });
});
