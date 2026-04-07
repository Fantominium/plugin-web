export default function AppPromotion() {
  return (
    <section aria-labelledby="app-promotion-heading" className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          id="app-promotion-heading"
          className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4"
        >
          Your Barbados Event Companion
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Plug In keeps you connected to every event happening across the island. Browse by date,
          category, or venue — then secure your spot in seconds.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-4xl mb-3" aria-hidden="true">
              🎟️
            </div>
            <h3 className="font-semibold text-[#1a1a2e] text-lg mb-2">Discover</h3>
            <p className="text-gray-600 text-sm">
              Find concerts, sports, festivals, and cultural events happening all across Barbados.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-4xl mb-3" aria-hidden="true">
              📅
            </div>
            <h3 className="font-semibold text-[#1a1a2e] text-lg mb-2">Plan</h3>
            <p className="text-gray-600 text-sm">
              Filter by date and category to find events that match your schedule and interests.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-4xl mb-3" aria-hidden="true">
              🎉
            </div>
            <h3 className="font-semibold text-[#1a1a2e] text-lg mb-2">Attend</h3>
            <p className="text-gray-600 text-sm">
              Get details, secure your tickets, and enjoy the best of what Barbados has to offer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
