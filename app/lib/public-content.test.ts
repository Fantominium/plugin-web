import type { PublicContactProfile, SocialLink } from '@/app/types/public-content';
import {
  getPublicContactProfile,
  getSocialLinks,
  HOMEPAGE_FEATURED_EMPTY_STATE,
  hasSocialLinks,
  PUBLIC_CONTACT_PROFILE,
} from './public-content';

describe('public-content configuration', () => {
  describe('PUBLIC_CONTACT_PROFILE', () => {
    it('has at least one direct contact method (email)', () => {
      // Arrange & Act — configuration is a module constant
      const profile = PUBLIC_CONTACT_PROFILE;

      // Assert — FR-004: at least one direct contact method must be present
      expect(profile.emailAddress).toBeTruthy();
      expect(profile.emailAddress).toMatch(/@/);
    });

    it('declares repository-config as its source (FR-004B)', () => {
      expect(PUBLIC_CONTACT_PROFILE.source).toBe('repository-config');
    });

    it('has a non-empty business name', () => {
      expect(PUBLIC_CONTACT_PROFILE.businessName.trim().length).toBeGreaterThan(0);
    });
  });

  describe('HOMEPAGE_FEATURED_EMPTY_STATE', () => {
    it('has a non-empty message', () => {
      // Arrange & Act — configuration is a module constant
      const emptyState = HOMEPAGE_FEATURED_EMPTY_STATE;

      // Assert — FR-028A: empty-state message must be clear
      expect(emptyState.message.trim().length).toBeGreaterThan(0);
    });

    it('routes the fallback CTA to /events (FR-028A)', () => {
      // The fallback href must point to the main Events page whenever
      // featured event content is unavailable.
      expect(HOMEPAGE_FEATURED_EMPTY_STATE.ctaHref).toBe('/events');
    });

    it('has a non-empty CTA label for the fallback action', () => {
      expect(HOMEPAGE_FEATURED_EMPTY_STATE.ctaLabel.trim().length).toBeGreaterThan(0);
    });
  });

  describe('getPublicContactProfile()', () => {
    it('returns the approved contact profile', () => {
      // Arrange & Act
      const profile = getPublicContactProfile();

      // Assert
      expect(profile).toBe(PUBLIC_CONTACT_PROFILE);
    });

    it('returns a profile with a valid email address', () => {
      const profile = getPublicContactProfile();
      expect(profile.emailAddress).toMatch(/@/);
    });
  });

  describe('hasSocialLinks()', () => {
    it('returns false when no approved social links exist (FR-004C)', () => {
      // Arrange — profile with empty social links (the initial approved state)
      const profileWithNone: PublicContactProfile = {
        ...PUBLIC_CONTACT_PROFILE,
        socialLinks: [],
      };

      // Act
      const result = hasSocialLinks(profileWithNone);

      // Assert — social-links section must be hidden when array is empty
      expect(result).toBe(false);
    });

    it('returns true when approved social links are present', () => {
      // Arrange
      const approvedLink: SocialLink = {
        platform: 'Instagram',
        label: 'Plug In on Instagram',
        href: 'https://instagram.com/pluginbim',
      };
      const profileWithLinks: PublicContactProfile = {
        ...PUBLIC_CONTACT_PROFILE,
        socialLinks: [approvedLink],
      };

      // Act
      const result = hasSocialLinks(profileWithLinks);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getSocialLinks()', () => {
    it('returns undefined when no approved social links exist (FR-004C)', () => {
      // Arrange
      const profileWithNone: PublicContactProfile = {
        ...PUBLIC_CONTACT_PROFILE,
        socialLinks: [],
      };

      // Act
      const result = getSocialLinks(profileWithNone);

      // Assert — undefined signals to render nothing, not an empty section
      expect(result).toBeUndefined();
    });

    it('returns the links array when approved links exist', () => {
      // Arrange
      const approvedLink: SocialLink = {
        platform: 'Facebook',
        label: 'Plug In on Facebook',
        href: 'https://facebook.com/pluginbim',
      };
      const profileWithLinks: PublicContactProfile = {
        ...PUBLIC_CONTACT_PROFILE,
        socialLinks: [approvedLink],
      };

      // Act
      const result = getSocialLinks(profileWithLinks);

      // Assert
      expect(result).toEqual([approvedLink]);
    });

    it('returns exactly the links present in the profile', () => {
      // Arrange
      const twoLinks: SocialLink[] = [
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
      const profileWithTwoLinks: PublicContactProfile = {
        ...PUBLIC_CONTACT_PROFILE,
        socialLinks: twoLinks,
      };

      // Act
      const result = getSocialLinks(profileWithTwoLinks);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(twoLinks);
    });
  });
});
