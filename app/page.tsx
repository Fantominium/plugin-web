import Hero from "@/app/components/Hero/Hero";
import AppPromotion from "@/app/components/AppPromotion/AppPromotion";
import Categories from "@/app/components/Categories/Categories";
import FeaturedEvents from "@/app/components/FeaturedEvents/FeaturedEvents";

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
