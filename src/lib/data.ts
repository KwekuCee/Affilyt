export interface Product {
  id: string;
  title: string;
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
  status: "Active" | "Suspended";
  paid: boolean;
  earnings: number;
  clicks: number;
  conversions: number;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Declined";
}

export const products: Product[] = [
  { id: "1", title: "Ultimate UX Design Guide", description: "Master UX design principles with real-world case studies.", price: 49, category: "E-books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", features: ["200+ pages", "Case studies", "Templates included", "Lifetime access"] },
  { id: "2", title: "SaaS Boilerplate Pro", description: "Launch your SaaS in days with this production-ready starter kit.", price: 149, category: "Software", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", features: ["Auth included", "Stripe integration", "Dashboard UI", "API routes"] },
  { id: "3", title: "Full-Stack Mastery Course", description: "Go from zero to full-stack developer in 12 weeks.", price: 199, category: "Courses", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", features: ["60+ hours video", "Live projects", "Certificate", "Community access"] },
  { id: "4", title: "Copywriting Secrets", description: "Write copy that converts. Proven frameworks inside.", price: 29, category: "E-books", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop", features: ["50 templates", "Swipe files", "Email sequences", "Landing pages"] },
  { id: "5", title: "AI Automation Toolkit", description: "Automate your workflows with cutting-edge AI tools.", price: 99, category: "Software", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", features: ["10+ integrations", "No-code setup", "API access", "Priority support"] },
  { id: "6", title: "Digital Marketing Bootcamp", description: "Master SEO, ads, and social media marketing.", price: 79, category: "Courses", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", features: ["40+ lessons", "Real campaigns", "Ad templates", "Monthly updates"] },
];

export const affiliates: Affiliate[] = [
  { id: "aff_001", name: "Kwame Asante", email: "kwame@example.com", avatar: "KA", status: "Active", paid: true, earnings: 2450, clicks: 1230, conversions: 49 },
  { id: "aff_002", name: "Ama Mensah", email: "ama@example.com", avatar: "AM", status: "Active", paid: true, earnings: 1890, clicks: 945, conversions: 38 },
  { id: "aff_003", name: "Yaw Boateng", email: "yaw@example.com", avatar: "YB", status: "Active", paid: true, earnings: 1320, clicks: 678, conversions: 26 },
  { id: "aff_004", name: "Efua Owusu", email: "efua@example.com", avatar: "EO", status: "Suspended", paid: true, earnings: 560, clicks: 320, conversions: 11 },
  { id: "aff_005", name: "Kofi Adjei", email: "kofi@example.com", avatar: "KJ", status: "Active", paid: true, earnings: 980, clicks: 510, conversions: 20 },
];

export const payoutRequests: PayoutRequest[] = [
  { id: "p1", affiliateId: "aff_001", affiliateName: "Kwame Asante", amount: 500, date: "2024-03-15", status: "Pending" },
  { id: "p2", affiliateId: "aff_002", affiliateName: "Ama Mensah", amount: 350, date: "2024-03-14", status: "Pending" },
  { id: "p3", affiliateId: "aff_003", affiliateName: "Yaw Boateng", amount: 200, date: "2024-03-13", status: "Pending" },
];

export const earningsData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  earnings: Math.floor(Math.random() * 150 + 20),
  clicks: Math.floor(Math.random() * 80 + 10),
}));
