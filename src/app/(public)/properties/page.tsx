import Image from "next/image";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertySearch from "@/components/shared/PropertySearch";
import { mockProperties } from "@/data/mockProperties";

export default function PropertiesPage() {

  return (
    <div className="w-full">
      {/* Hero Header with Background Image */}
      <div className="relative w-full py-44 mb-10 flex items-center justify-center bg-brand-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/footer/front_image1.png"
            alt="Properties Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Find Your Dream Property</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Browse our extensive collection of properties across the city.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">

        <PropertySearch />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map(prop => (
            <PropertyCard key={prop.id} {...prop} />
          ))}
        </div>
      </div>

    </div>
  );
}
