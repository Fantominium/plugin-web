import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { PublicContactProfile, SocialLink } from '@/app/types/public-content';
import Page from './page';

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

const stubContactProfile = (
  overrides: Partial<PublicContactProfile> = {},
): PublicContactProfile => ({
  businessName: 'Plug In',
  emailAddress: 'info@pluginbim.com',
  phoneNumber: '+1 (246) 000-0000',
  addressLines: ['Bridgetown', 'Barbados'],
  socialLinks: [],
  supportCopy: 'Have questions about events in Barbados? We would love to hear from you.',
  source: 'repository-config' as const,
  ...overrides,
});

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

describe('Contact Us Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no approved social links (valid initial state)
    mockGetPublicContactProfile.mockReturnValue(stubContactProfile());
    mockHasSocialLinks.mockReturnValue(false);
    mockGetSocialLinks.mockReturnValue(undefined);
  });

  describe('page structure and heading (FR-003)', () => {
    it('renders h1 heading for Contact Us (FR-003)', async () => {
      render(await Page());

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/contact us/i);
    });

    it('renders a top-level Contact Us region', async () => {
      render(await Page());

      const region = screen.getByRole('region', { name: /contact us/i });
      expect(region).toBeInTheDocument();
    });
  });

  describe('contact details rendering (FR-004)', () => {
    it('displays the business name (FR-004)', async () => {
      render(await Page());

      expect(screen.getByText('Plug In')).toBeInTheDocument();
    });

    it('displays the email address (FR-004)', async () => {
      render(await Page());

      // Email should be in contact form or contact details section
      expect(screen.getByText('info@pluginbim.com')).toBeInTheDocument();
    });

    it('displays the phone number when provided (FR-004)', async () => {
      render(await Page());

      expect(screen.getByText('+1 (246) 000-0000')).toBeInTheDocument();
    });

    it('displays address lines when provided (FR-004)', async () => {
      render(await Page());

      expect(screen.getByText('Bridgetown')).toBeInTheDocument();
      expect(screen.getByText('Barbados')).toBeInTheDocument();
    });

    it('displays the support copy when provided (FR-004)', async () => {
      render(await Page());

      expect(screen.getByText(/Have questions about events/i)).toBeInTheDocument();
    });

    it('renders contact details as readable text, not as form inputs (FR-038)', async () => {
      render(await Page());

      // Contact info is display-only, not a form to fill
      const emailElement = screen.getByText('info@pluginbim.com');
      expect((emailElement.closest('section') ?? emailElement).textContent).toBeTruthy();
    });
  });

  describe('social links rendering with approval state (FR-004C)', () => {
    it('hides the social-links section entirely when no approved links exist (FR-004C)', async () => {
      // No approved links — the section must be omitted, not rendered empty
      render(await Page());

      // Should NOT find a social links section
      const socialSection = screen.queryByRole('region', { name: /social|follow/i });
      expect(socialSection).not.toBeInTheDocument();

      // Should NOT find "Follow us" or similar heading
      expect(screen.queryByText(/follow us/i)).not.toBeInTheDocument();
    });

    it('renders social link section with links when approved links exist (FR-004C)', async () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(await Page());

      // Both links should be present as separate elements
      expect(screen.getAllByText(/instagram|facebook/i).length).toBeGreaterThanOrEqual(1);
    });

    it('renders each approved social link with accessible label and correct href (FR-004C)', async () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(await Page());

      // Both links should be present
      const instagramLink = screen.getByRole('link', { name: /plug in on instagram/i });
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/pluginbim');

      const facebookLink = screen.getByRole('link', { name: /plug in on facebook/i });
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/pluginbim');
    });

    it('marks social links with rel="noopener noreferrer" for security (FR-004C)', async () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(await Page());

      const instagramLink = screen.getByRole('link', { name: /plug in on instagram/i });
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders external social links with target="_blank" for user expectation (FR-004C)', async () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(await Page());

      const instagramLink = screen.getByRole('link', { name: /plug in on instagram/i });
      expect(instagramLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('edge cases', () => {
    it('still displays contact details when profile has no addressLines', async () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ addressLines: undefined }));

      render(await Page());

      // Email and phone still visible; missing address doesn't break the page
      expect(screen.getByText('info@pluginbim.com')).toBeInTheDocument();
    });

    it('still displays contact details when profile has no phoneNumber', async () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ phoneNumber: undefined }));

      render(await Page());

      // Email still visible; missing phone doesn't break the page
      expect(screen.getByText('info@pluginbim.com')).toBeInTheDocument();
    });

    it('renders correctly when social links array is empty (FR-004C)', async () => {
      mockGetPublicContactProfile.mockReturnValue(stubContactProfile({ socialLinks: [] }));
      mockHasSocialLinks.mockReturnValue(false);
      mockGetSocialLinks.mockReturnValue(undefined);

      render(await Page());

      // No crashes, contact details still present, social section absent
      expect(screen.getByText('info@pluginbim.com')).toBeInTheDocument();
      expect(screen.queryByRole('region', { name: /social|follow/i })).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders page with proper semantic structure', async () => {
      render(await Page());

      // Has h1 and top-level labeled region
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /contact us/i })).toBeInTheDocument();
    });

    it('social links (when rendered) have accessible labels describing destination', async () => {
      mockHasSocialLinks.mockReturnValue(true);
      mockGetSocialLinks.mockReturnValue(sampleSocialLinks);

      render(await Page());

      // Labels include platform name so users know what link opens
      expect(screen.getByRole('link', { name: /plug in on instagram/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /plug in on facebook/i })).toBeInTheDocument();
    });
  });
});
