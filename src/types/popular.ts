export type PopularPropertyApiItem = {
  id: number;
  type: string;
  title: string;
  price: string;
  location: string;
  image: string | null;
  order: number;
  status: "active" | "inactive";
  propertyId: number | null;
  property?: { id: number; name: string; permalink: string | null } | null;
  cities?: string[];
  cityOrders?: Record<string, number>;
};

export type PopularRegionApiItem = {
  id: number;
  name: string;
  propertiesCount: number;
  growthRate: string;
  image: string | null;
  order: number;
  status: "active" | "inactive";
  locations: string[] | null;
  cities?: string[];
  cityOrders?: Record<string, number>;
};
