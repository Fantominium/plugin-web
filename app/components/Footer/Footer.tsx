import Link from 'next/link';
import { getPublicContactProfile, getSocialLinks, hasSocialLinks } from '@/app/lib/public-content';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';

export default function Footer() {
  const contactProfile = getPublicContactProfile();
  const showSocialLinks = hasSocialLinks(contactProfile);
  const socialLinks = getSocialLinks(contactProfile);

  return (
    <footer className="bg-[#1a1a2e] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Business info section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{contactProfile.businessName}</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Email
                </span>
                <Link
                  href={`mailto:${contactProfile.emailAddress}`}
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded"
                >
                  {contactProfile.emailAddress}
                </Link>
              </div>
              {contactProfile.phoneNumber && (
                <div>
                  <span className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Phone
                  </span>
                  <Link
                    href={`tel:${contactProfile.phoneNumber}`}
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded"
                  >
                    {contactProfile.phoneNumber}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Navigation links section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Navigate</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link
                    href={PUBLIC_ROUTES.home}
                    className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href={PUBLIC_ROUTES.events}
                    className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href={PUBLIC_ROUTES.contactUs}
                    className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={PUBLIC_ROUTES.privacyPolicy}
                    className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={PUBLIC_ROUTES.termsAndConditions}
                    className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social links section — only render if approved social links exist (FR-004C) */}
          {showSocialLinks && socialLinks && (
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <nav aria-label="Social media links">
                <ul className="space-y-2 list-none p-0 m-0">
                  {socialLinks.map((link) => (
                    <li key={link.platform}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] rounded px-2 py-1 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Plug In Barbados. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
