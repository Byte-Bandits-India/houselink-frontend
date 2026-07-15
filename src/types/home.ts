export type HeroBadge = {
  id: string;
  iconName: "ShieldCheck" | "MapPin" | "Award" | "Headphones";
  title: string;
  subtitle: string;
};

export type HeroSlide = {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export type CityCardProps = {
  image: string;
  name: string;
  propertiesCount: number;
  growthRate: string;
};

export type WhatWeDoItem = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  image: string;
};

export type UpcomingProperty = {
  id: string;
  title: string;
  category: string;
  purpose: "Sale" | "Rent" | "Lease";
  location: string;
  price: string;
  image: string;
};

export type IntroVideoConfig = {
  posterImage: string;
  youtubeEmbedUrl: string;
  youtubeTitle: string;
};

export type BannerSlide = {
  id: number;
  name: string;
  image: string;
  pcImage: string;
  tabletImage: string;
  mobileImage: string;
  url: string | null;
  openInNewTab: boolean;
};

export type HighDemandPropertyCardProps = {
  image: string;
  type: string;
  title: string;
  price: string;
  location: string;
};
