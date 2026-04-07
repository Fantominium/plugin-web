import type { PublicContactProfile, SocialLink } from '@/app/types/public-content';

export const PUBLIC_CONTACT_PROFILE: Readonly<PublicContactProfile> = {
  businessName: 'Plug In',
  emailAddress: 'info@pluginbim.com',
  phoneNumber: '+1 (246) 000-0000',
  addressLines: ['Bridgetown', 'Barbados'],
  socialLinks: [
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
  ] satisfies SocialLink[],
  supportCopy: "Have questions about events in Barbados? We'd love to hear from you.",
  source: 'repository-config',
} as const;
