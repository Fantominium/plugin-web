import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { PublicContactProfile, SocialLink } from '@/app/types/public-content';
import Footer from './Footer';

// Mock the public-content module
jest.mock('@/app/lib/public-content', () => ({
  getPublicContactProfile: jest.fn(),
  hasSocialLinks: jest.fn(),
  getSocialLinks: jest.fn(),
}));

import { getPublicContactProfile, getSocialLinks, hasSocialLinks } from '@/app/lib/public-content';

const mockGetPublicContactProfile = jest.mocked(getPublicContactProfile);
const mockHasSocialLinks = jest.mocked(hasSocialLinks);
const mockGetSocialLinks = jest.mocked(getSocialLinks);

const BASE_CONTACT_PROFILE: PublicContactProfile = {
  businessName: 'Plug In',
  emailAddress: 'info@pluginbim.com',
  phoneNumber: '+1 (246) 000-0000',
  addressLines: ['Bridgetown', 'Barbados'],
  socialLinks: [],
  supportCopy: 'Contact us for more information.',
  source: 'repository-config',
};

const stubContactProfile = (
  overrides: Omit<Partial<PublicContactProfile>, 'source'> = {},
): PublicContactProfile => {
  const profile = {
    ...BASE_CONTACT_PROFILE,
    ...overrides,
    source: 'repository-config' as const,
  } satisfies Readonly<PublicContactProfile>;

  return profile;
};

const sampleSocialLinks: SocialLink[] = [
  {
    platform: 'Instagram',
    label: 'Plug In on Instagram',
    href: 'https://instagram.com/pluginbim',
  },
  {
    platform: 'Facebook',
    label: 'Plug In on Facebook',
    href: 'https://facebook.com/pluginbim',
  },
];

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no approved social links (valid initial state per FR-004C)
    mockGetPublicContactProfile.mockReturnValue(stubContactProfile());
    mockHasSocialLinks.mockReturnValue(false);
    mockGetSocialLinks.mockReturnValue(undefined);
  });

  describe('structure and rendering', () => {
    it('renders footer element', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('displays business name from contact profile', () => {
      render(<Footer />);

      expect(screen.getByText('Plug In')).toBeInTheDocument();
    });

    it('displays contact email address', () => {
      render(<Footer />);

      expect(screen.getByText('info@pluginbim.com')).toBeInTheDocument();
    });

    it('displays navigation links to main public routes', () => {
      render(<Footer />);

      // Links to home, events, contact-us, privacy-policy, terms-and-conditions
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events');
      expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute(
        'href',
        '/contact-us',
      );
    });
  });

  describe('social links with approval state (FR-004C)', () => {
    it('hides social links section entirely when no approved links exist (FR-004C)', () => {
      // Default: no approved links, hasSocialLinks returns false
      render(<Footer />);

      // Should NOT find a social links section when empty
      const socialSection = screen.queryByRole('region', { name: /social|follow/i });
      expect(socialSection).not.toBeInTheDocument();

      // Should NOT find individual social link items
      expect(screen.queryByRole('link', { name: /instagram|facebook/i })).not.toBeInTheDocument();
    });

    it('renders social links section when approved links exist (FR-004C)', () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(<Footer />);

      // Social section should be visible with links
      expect(screen.getByRole('link', { name: /plug in on instagram/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /plug in on facebook/i })).toBeInTheDocument();
    });

    it('renders each approved social link with correct href and accessible label (FR-004C)', () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(<Footer />);

      const instagramLink = screen.getByRole('link', { name: /plug in on instagram/i });
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/pluginbim');
      expect(instagramLink).toHaveAttribute('target', '_blank');

      const facebookLink = screen.getByRole('link', { name: /plug in on facebook/i });
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/pluginbim');
      expect(facebookLink).toHaveAttribute('target', '_blank');
    });

    it('marks social links with rel="noopener noreferrer" for security (FR-004C)', () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(<Footer />);

      const links = screen.getAllByRole('link');
      const socialLinks = links.slice(-2); // Last two are the social links in this test

      socialLinks.forEach((link) => {
        if (
          link.getAttribute('href')?.includes('instagram') ||
          link.getAttribute('href')?.includes('facebook')
        ) {
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });
  });

  describe('edge cases', () => {
    it('renders footer correctly with empty social links array (FR-004C)', () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ socialLinks: [] }));
      mockHasSocialLinks.mockReturnValue(false);
      mockGetSocialLinks.mockReturnValue(undefined);

      render(<Footer />);

      // Contact info present, social section absent
      expect(screen.getByText('Plug In')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /instagram|facebook/i })).not.toBeInTheDocument();
    });

    it('does not crash when address lines are missing', () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ addressLines: undefined }));

      render(<Footer />);

      // Footer still renders
      expect(screen.getByText('Plug In')).toBeInTheDocument();
    });

    it('does not crash when phone number is missing', () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ phoneNumber: undefined }));

      render(<Footer />);

      // Footer still renders
      expect(screen.getByText('Plug In')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('footer has contentinfo role for semantic landmark', () => {
      render(<Footer />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('social links (when rendered) have descriptive accessible labels', () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(<Footer />);

      // Labels describe what link opens
      expect(screen.getByRole('link', { name: /plug in on instagram/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /plug in on facebook/i })).toBeInTheDocument();
    });

    it('navigation links have accessible labels', () => {
      render(<Footer />);

      // Links should be clearly labeled for assistive tech
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
    });
  });
});
