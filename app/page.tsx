import Hero from "./components/Hero";
import AppPromotion from "./components/AppPromotion";
import Categories from "./components/Categories";
import FeaturedEvents from "./components/FeaturedEvents";

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
