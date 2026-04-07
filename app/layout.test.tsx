import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';

function ShellUnderTest({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}

describe('RootLayout shell navigation integration', () => {
  it('renders shared shell landmarks around page content', () => {
    render(<ShellUnderTest>{<div>Homepage content</div>}</ShellUnderTest>);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Homepage content')).toBeInTheDocument();
  });

  it('renders footer journeys to public events and contact routes', () => {
    render(<ShellUnderTest>{<div>Homepage content</div>}</ShellUnderTest>);

    const eventsLinks = screen.getAllByRole('link', { name: /^events$/i });
    expect(eventsLinks.length).toBeGreaterThan(0);
    eventsLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/events');
    });

    const contactLinks = screen.getAllByRole('link', { name: /^contact us$/i });
    expect(contactLinks.length).toBeGreaterThan(0);
    contactLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/contact-us');
    });
  });

  it('renders a mobile header menu with implemented routes only', async () => {
    Object.defineProperty(globalThis, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });

    const user = userEvent.setup();
    render(<ShellUnderTest>{<div>Homepage content</div>}</ShellUnderTest>);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const mobileNav = screen.getByRole('navigation', {
      name: /mobile navigation/i,
      hidden: true,
    });
    const links = Array.from(mobileNav.querySelectorAll('a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual(['/', '/events', '/contact-us', '/privacy-policy']);
  });
});
