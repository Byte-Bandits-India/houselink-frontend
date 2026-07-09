export interface HeroBadge {
    id: string;
    iconName: "ShieldCheck" | "MapPin" | "Award" | "Headphones";
    title: string;
    subtitle: string;
}

export interface HeroSlide {
    id: string | number;
    image: string;
    title: string;
    subtitle?: string;
    description?: string;
}

export interface CityCardProps {
    image: string;
    name: string;
    propertiesCount: number;
    growthRate: string;
}

export interface WhatWeDoItem {
    id: string;
    title: string;
    description: string;
    linkText: string;
    href: string;
    image: string;
}

export interface TrendingCity {
    name: string;
    propertiesCount: number;
    growthRate: string;
    image: string;
}

export interface HighDemandProperty {
    type: string;
    title: string;
    price: string;
    location: string;
    image: string;
}

export interface UpcomingProperty {
    id: string;
    title: string;
    category: string;
    purpose: "Sale" | "Rent" | "Lease";
    location: string;
    price: string;
    image: string;
}

export interface IntroVideoConfig {
    posterImage: string;
    youtubeEmbedUrl: string;
    youtubeTitle: string;
}
