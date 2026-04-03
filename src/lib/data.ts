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
  trustScore: number; // New: 0-100
  refundRate: number; // New: %
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

export const products: Product[] = [
  {
    id: "1",
    title: "Quantum Ledger Pro",
    price: 499,
    description: "Institutional-grade digital asset tracking with zero-latency synchronization across 40 nodes. Includes hardware security integration.",
    category: "HARDWARE",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    features: ["Multi-Sig", "Air-Gapped", "API Access"],
    epc: 12.45,
    cr: 4.2,
    trustScore: 98,
    refundRate: 0.2,
    contentAssets: {
      emails: ["The most secure ledger on the market is here...", "Secure your digital future with Quantum Ledger Pro"],
      socialPosts: ["Institutional security for everyone. Quantum Ledger Pro is the new standard.", "Digital growth requires digital security. Quantum Ledger Pro."],
      banners: ["https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=400&q=80"]
    }
  },
  {
    id: "2",
    title: "SaaS Scaling Infrastructure",
    price: 1299,
    description: "High-performance cloud backbone for scaling digital operations. Includes priority load-balancing and direct executive support.",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    features: ["Auto-Scaling", "Global CDN", "DDoS Protection"],
    epc: 24.80,
    cr: 3.1,
    trustScore: 95,
    refundRate: 1.1,
    contentAssets: {
      emails: ["Scaling your SaaS shouldn't be a headache...", "Ready for institutional-grade scaling?"],
      socialPosts: ["From 1 to 1M users with zero downtime. Get the scaling infrastructure used by elite partners."],
      banners: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"]
    }
  },
  {
    id: "3",
    title: "Executive Training Protocol",
    price: 199,
    description: "The definitive guide to institutional affiliate marketing. Blueprint for building high-yield referral engines from zero.",
    category: "EDUCATION",
    image: "https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&w=800&q=80",
    features: ["Video Modules", "Direct Liaison", "Resource Vault"],
    epc: 8.90,
    cr: 12.5,
    trustScore: 99,
    refundRate: 0.1,
    contentAssets: {
      emails: ["Ready to join the 1% of affiliate marketers?", "Stop guessing and start using the Protocol."],
      socialPosts: ["Institutional results require institutional protocols. Join the elite."],
      banners: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80"]
    }
  },
  {
    id: "4",
    title: "Venture Data Insight",
    price: 249,
    description: "Proprietary market intelligence platform. Real-time tracking of venture capital flows and institutional asset migrations.",
    category: "ANALYTICS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    features: ["Live Updates", "Whale Tracking", "Custom Alerts"],
    epc: 15.60,
    cr: 5.8,
    trustScore: 92,
    refundRate: 2.3,
    contentAssets: {
      emails: ["See the whales before they move...", "Institutional market intelligence is now at your fingertips."],
      socialPosts: ["Stop following the trend. Start seeing it early."],
      banners: ["https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&w=400&q=80"]
    }
  }
];

export const earningsData: EarningData[] = [
  { day: "Day 1", earnings: 450, clicks: 1200, conversions: 48 },
  { day: "Day 2", earnings: 980, clicks: 2400, conversions: 96 },
  { day: "Day 3", earnings: 720, clicks: 1800, conversions: 72 },
  { day: "Day 4", earnings: 1450, clicks: 3600, conversions: 144 },
  { day: "Day 5", earnings: 1200, clicks: 3000, conversions: 120 },
  { day: "Day 6", earnings: 2100, clicks: 5200, conversions: 208 },
  { day: "Day 7", earnings: 2450, clicks: 6100, conversions: 244 },
];

export const milestones: Milestone[] = [
  { id: "1", title: "Institutional Entry", description: "Successfully authorized your first operational cycle.", icon: "Shield", achieved: true },
  { id: "2", title: "Velocity King", description: "Reached a conversion rate higher than 5% on 3 products.", icon: "Zap", achieved: true, rewardLabel: "+2% Commission" },
  { id: "3", title: "First Inflow ($1k)", description: "Secured your first $1,000 in approved referral earnings.", icon: "Target", achieved: true },
  { id: "4", title: "The Alpha Lead", description: "Generated 10 high-value leads in a single 24-hour cycle.", icon: "Trophy", achieved: false, rewardLabel: "VIP Asset Access" },
  { id: "5", title: "Institutional Authority", description: "Scaling your network to over 500 active referrals.", icon: "Award", achieved: false, rewardLabel: "Direct Executive Line" },
];

export const blogPosts = [
  {
    id: "1",
    title: "The Shift to Institutional Affiliate Assets",
    excerpt: "Why the smart money is moving away from low-ticket consumer goods toward high-yield digital infrastructure.",
    author: "Sterling Cooper",
    date: "March 28, 2024",
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "2",
    title: "Scaling Your Referral Engine to $10k/Month",
    excerpt: "The exact blueprint used by our top Pro-Tier partners to achieve consistent institutional-grade results.",
    author: "Julianne Pierce",
    date: "March 24, 2024",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "3",
    title: "Decoding Real-Time EPC Metrics",
    excerpt: "Understanding the data behind the dollars. How to read the Executive Ledger telemetry to optimize your routing.",
    author: "Marcus Thorne",
    date: "March 21, 2024",
    category: "Intelligence",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80"
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Alex Chen",
    role: "CEO, DataVentures",
    content: "The transition to the Executive Ledger changed our entire P&L. We're seeing 4x the yield compared to traditional networks.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "Pro Partner",
    content: "Institutional support and the Pro Training protocols allowed me to scale my referral engine with absolute precision.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "3",
    name: "David Miller",
    role: "Growth Strategist",
    content: "The real-time telemetry and EPC tracking give us an unfair advantage. It's not just a platform; it's an infrastructure.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
  }
];
