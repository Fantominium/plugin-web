import Link from 'next/link';
import { getSocialLinks } from '@/app/lib/public-content';
import type { PublicContactProfile } from '@/app/types/public-content';

interface ContactUsProps {
  profile: Readonly<PublicContactProfile>;
}

export default function ContactUs({ profile }: Readonly<ContactUsProps>) {
  const socialLinks = getSocialLinks(profile);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      {/* Business name and support copy */}
      <div className="mb-12">
        <p className="text-gray-600 mb-4">{profile.supportCopy}</p>
      </div>

      {/* Contact details section */}
      <section
        aria-labelledby="contact-details-heading"
        className="mb-12 p-8 bg-gray-50 rounded-lg"
      >
        <h2 id="contact-details-heading" className="text-2xl font-bold text-[#1a1a2e] mb-6">
          Contact Details
        </h2>

        <div className="space-y-4">
          {/* Business name */}
          <div>
            <h3 className="font-semibold text-[#1a1a2e] text-sm uppercase tracking-wide mb-1">
              Business
            </h3>
            <p className="text-gray-700">{profile.businessName}</p>
          </div>

          {/* Email */}
          <div>
            <h3 className="font-semibold text-[#1a1a2e] text-sm uppercase tracking-wide mb-1">
              Email
            </h3>
            <Link
              href={`mailto:${profile.emailAddress}`}
              className="text-[#667eea] hover:text-[#764ba2] focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 rounded"
            >
              {profile.emailAddress}
            </Link>
          </div>

          {/* Phone number (if present) */}
          {profile.phoneNumber && (
            <div>
              <h3 className="font-semibold text-[#1a1a2e] text-sm uppercase tracking-wide mb-1">
                Phone
              </h3>
              <Link
                href={`tel:${profile.phoneNumber}`}
                className="text-[#667eea] hover:text-[#764ba2] focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 rounded"
              >
                {profile.phoneNumber}
              </Link>
            </div>
          )}

          {/* Address (if present) */}
          {profile.addressLines && profile.addressLines.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#1a1a2e] text-sm uppercase tracking-wide mb-1">
                Location
              </h3>
              <address className="not-italic">
                {profile.addressLines.map((line) => (
                  <div key={line} className="text-gray-700">
                    {line}
                  </div>
                ))}
              </address>
            </div>
          )}
        </div>
      </section>

      {/* Social links section (only render if links are approved — FR-004C) */}
      {socialLinks && socialLinks.length > 0 && (
        <section
          aria-labelledby="social-links-heading"
          className="p-8 bg-white border border-gray-200 rounded-lg"
        >
          <h2 id="social-links-heading" className="text-2xl font-bold text-[#1a1a2e] mb-6">
            Follow Us
          </h2>

          <ul className="space-y-3 list-none p-0 m-0">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#667eea] hover:text-[#764ba2] font-semibold focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 rounded px-2 py-1"
                >
                  {link.label}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
