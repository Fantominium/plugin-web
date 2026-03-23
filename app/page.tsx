import AppPromotion from '@/app/components/AppPromotion/AppPromotion';
import Categories from '@/app/components/Categories/Categories';
import FeaturedEvents from '@/app/components/FeaturedEvents/FeaturedEvents';
import Hero from '@/app/components/Hero/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <AppPromotion />
      <Categories />
      <FeaturedEvents />
    </main>
  );
}
