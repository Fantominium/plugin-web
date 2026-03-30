import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { fetchEventList } from '@/app/lib/event-service';
import Page from './page';

jest.mock('@/app/lib/event-service', () => ({
  fetchEventList: jest.fn(),
}));

const mockFetchEventList = fetchEventList as jest.MockedFunction<typeof fetchEventList>;

describe('Events Page', () => {
  beforeEach(() => {
    mockFetchEventList.mockResolvedValue({
      success: true,
      data: [
        {
          id: 10,
          title: 'Public Test Event',
          date: '2026-04-01',
          category: 'Conference',
          location: 'Bridgetown',
        },
      ],
      total: 1,
      page: 1,
      limit: 24,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders events heading and primary content', async () => {
    render(await Page());

    expect(screen.getByRole('heading', { level: 1, name: /discover events/i })).toBeInTheDocument();
    expect(screen.getByText(/find upcoming events across barbados/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('remains a valid destination for homepage fallback navigation', async () => {
    render(await Page());

    // Homepage fallback CTAs target /events; this page must present a complete discovery surface.
    expect(screen.getByRole('heading', { level: 1, name: /discover events/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /public events/i })).toBeInTheDocument();
  });

  it('renders event card and detail navigation link', async () => {
    render(await Page());

    expect(screen.getByText('Public Test Event')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/events/10',
    );
  });

  it('renders empty state when no events are available', async () => {
    mockFetchEventList.mockResolvedValue({
      success: true,
      data: [],
      total: 0,
      page: 1,
      limit: 24,
    });

    render(await Page());

    expect(screen.getByText(/no events are available right now/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/coming soon|placeholder|under construction/i),
    ).not.toBeInTheDocument();
  });
});
