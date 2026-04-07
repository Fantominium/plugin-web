import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/app/lib/public-routes';

const CATEGORIES = [
  { id: 'concerts', label: 'Concerts', emoji: '🎵', description: 'Live music and performances' },
  { id: 'sports', label: 'Sports', emoji: '⚽', description: 'Games, races, and competitions' },
  {
    id: 'festivals',
    label: 'Festivals',
    emoji: '🎊',
    description: 'Cultural and community celebrations',
  },
  {
    id: 'food',
    label: 'Food & Drink',
    emoji: '🍹',
    description: 'Tastings, pop-ups, and culinary events',
  },
  {
    id: 'art',
    label: 'Art & Culture',
    emoji: '🎨',
    description: 'Exhibitions, shows, and cultural experiences',
  },
] as const;

export default function Categories() {
  return (
    <section aria-labelledby="categories-heading" className="py-16 px-4 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        <h2
          id="categories-heading"
          className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3 text-center"
        >
          Browse by Category
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Find exactly the kind of event you&apos;re looking for.
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 list-none p-0 m-0">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <Link
                href={PUBLIC_ROUTES.events}
                aria-label={`Browse ${cat.label} events`}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2"
              >
                <span className="text-4xl mb-3" aria-hidden="true">
                  {cat.emoji}
                </span>
                <span className="font-semibold text-[#1a1a2e] text-sm">{cat.label}</span>
                <span className="text-xs text-gray-500 mt-1">{cat.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
