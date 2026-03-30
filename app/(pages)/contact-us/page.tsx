import type { Metadata } from 'next';
import ContactUs from '@/app/components/ContactUs/ContactUs';
import { getPublicContactProfile } from '@/app/lib/public-content';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Plug In. Find our contact details, phone number, email, and approved social links.',
};

export default function ContactUsPage() {
  const profile = getPublicContactProfile();

  return (
    <section aria-labelledby="contact-us-heading" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1
          id="contact-us-heading"
          className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4 text-center"
        >
          Contact Us
        </h1>

        <ContactUs profile={profile} />
      </div>
    </section>
  );
}
