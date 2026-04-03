export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  category: "E-books" | "Software" | "Courses";
  image: string;
  features: string[];
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subtitle: string;
  status: "Active" | "Suspended";
  registrationType: string;
  paid: boolean;
  earnings: number;
  volume: string;
  clicks: number;
  conversions: number;
}

export interface PayoutRequest {
  id: string;
  requestId: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  method: string;
  date: string;
  status: "Pending" | "Approved" | "Declined";
}

export const products: Product[] = [
  { id: "1", title: "Executive Strategy: The 2024 Framework", subtitle: "Digital Course / PDF Bundle", description: "Institutional roadmap for scaling global operations with proven frameworks.", price: 199, category: "Courses", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", features: ["200+ pages", "Case studies", "Templates included", "Lifetime access"] },
  { id: "2", title: "AffiliateFlow Pro Dashboard", subtitle: "SaaS Subscription (Monthly)", description: "Real-time enterprise monitoring software designed for high-volume affiliates.", price: 299, category: "Software", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", features: ["Auth included", "Stripe integration", "Dashboard UI", "API routes"] },
  { id: "3", title: "The Digital Arbitrage Playbook", subtitle: "Premium E-book", description: "Definitive 400-page guide to modern marketplace arbitrage strategies.", price: 49, category: "E-books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", features: ["400+ pages", "Swipe files", "Templates", "Community access"] },
  { id: "4", title: "SEO for High-Ticket Markets", subtitle: "Digital Course", description: "Dominate premium affiliate niches using white-hat SEO strategies.", price: 149, category: "Courses", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", features: ["50 lessons", "Real campaigns", "Ad templates", "Monthly updates"] },
  { id: "5", title: "LedgerSync: API Hub", subtitle: "Software Platform", description: "Centralize marketplace payouts and data streams in one platform.", price: 199, category: "Software", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", features: ["10+ integrations", "No-code setup", "API access", "Priority support"] },
  { id: "6", title: "Affiliate Contract Templates", subtitle: "Legal E-book Bundle", description: "Legally vetted templates for agency-style affiliate operations.", price: 79, category: "E-books", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop", features: ["50 templates", "Legal review", "Editable files", "Updates included"] },
];

export const affiliates: Affiliate[] = [
  { id: "aff_001", name: "Horizon Ventures", email: "horizon@ventures.com", avatar: "HV", subtitle: "ID: SE-8829", status: "Active", registrationType: "PAID REGISTRATION", paid: true, earnings: 2450, volume: "$1.2M / mo", clicks: 1230, conversions: 49 },
  { id: "aff_002", name: "Apex Dynamics", email: "apex@dynamics.com", avatar: "AD", subtitle: "ID: SE-4412", status: "Suspended", registrationType: "INSTITUTIONAL", paid: true, earnings: 1890, volume: "$450k / mo", clicks: 945, conversions: 38 },
  { id: "aff_003", name: "Vanguard Digital Solutions", email: "vanguard@digital.com", avatar: "VD", subtitle: "ID: SE-7201", status: "Active", registrationType: "PAID REGISTRATION", paid: true, earnings: 1320, volume: "$890k / mo", clicks: 678, conversions: 26 },
  { id: "aff_004", name: "Precision Capital Group", email: "precision@capital.com", avatar: "PC", subtitle: "ID: SE-5518", status: "Active", registrationType: "INSTITUTIONAL", paid: true, earnings: 560, volume: "$320k / mo", clicks: 320, conversions: 11 },
  { id: "aff_005", name: "Global SaaS LTD", email: "global@saas.com", avatar: "GS", subtitle: "ID: SE-9934", status: "Active", registrationType: "PAID REGISTRATION", paid: true, earnings: 980, volume: "$670k / mo", clicks: 510, conversions: 20 },
];

export const payoutRequests: PayoutRequest[] = [
  { id: "p1", requestId: "PQ-1102", affiliateId: "aff_001", affiliateName: "Horizon Ventures", amount: 12450, method: "Wire Transfer", date: "2024-03-15", status: "Pending" },
  { id: "p2", requestId: "PQ-1105", affiliateId: "aff_005", affiliateName: "Global SaaS LTD", amount: 3800.20, method: "PayPal Business", date: "2024-03-14", status: "Pending" },
  { id: "p3", requestId: "PQ-1099", affiliateId: "aff_002", affiliateName: "Apex Dynamics", amount: 52100, method: "SWIFT", date: "2024-03-13", status: "Pending" },
];

export const earningsData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  earnings: Math.floor(Math.random() * 150 + 20),
  clicks: Math.floor(Math.random() * 80 + 10),
}));
