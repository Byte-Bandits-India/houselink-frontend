const cities = [
    { name: "Delhi", href: "#" },
    { name: "Mumbai", href: "#" },
    { name: "Bangalore", href: "#" },
    { name: "Jaipur", href: "#" },
    { name: "Chennai", href: "#" },
];

export default function TopTrendingCities() {
    return (
        <section className="py-10 px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
                Top Trending cities
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
                {cities.map((city) => (
                    <div
                        key={city.name}
                        className="w-44 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                        <p className="text-sm font-bold text-gray-900 mb-1">{city.name}</p>
                        <a
                            href={city.href}
                            className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
                        >
                            Explore
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}