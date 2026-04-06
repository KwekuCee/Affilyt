export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  features: string[];
  epc: number;
  cr: number;
  trustScore: number;
  refundRate: number;
  contentAssets: {
    emails: string[];
    socialPosts: string[];
    banners: string[];
  };
}

export interface EarningData {
  day: string;
  earnings: number;
  clicks: number;
  conversions: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  rewardLabel?: string;
}

// No demo products — all products come from the database
export const products: Product[] = [];

export const earningsData: EarningData[] = [];

export const milestones: Milestone[] = [];

// No demo blog posts — managed from superadmin
export const blogPosts: any[] = [];

// No demo testimonials — managed from superadmin
export const testimonials: any[] = [];
