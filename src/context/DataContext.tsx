import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, products as initialProducts } from "@/lib/data";

export type SellerTier = "Basic" | "Standard" | "Pro";
export type UserRole = "ADMIN" | "MANAGER" | "AFFILIATE" | "SUB_AFFILIATE";
export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "ARCHIVED";

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    status: UserStatus;
    earnings: number;
    clicks: number;
    conversions: number;
    packageTier: SellerTier;
    joinedDate: string;
    paymentInfo?: string;
    performanceScore: number;
}

export interface Payout {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    method: string;
    status: "PENDING" | "PROCESSED" | "REJECTED";
    date: string;
    invoiceId: string;
}

export interface AnalyticsEvent {
    id: string;
    type: "CLICK" | "CONVERSION";
    affiliateId: string;
    productId: string;
    timestamp: string;
    ip: string;
    geo: string;
    device: "DESKTOP" | "MOBILE";
    amount?: number;
}

export interface Package {
    name: SellerTier;
    price: number;
    commission: number;
    payoutSchedule: string;
}

export interface Contest {
    id: string;
    title: string;
    description: string;
    target: number;
    reward: number;
    startDate: string;
    endDate: string;
    participants: number;
    status: "ACTIVE" | "COMPLETED" | "DRAFT";
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    earnings: number;
    conversions: number;
    tier: SellerTier;
}

export interface BlogItem {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
}

export interface LandingContent {
    heroTitle: string;
    heroSubtitle: string;
    stats: { label: string; value: string; icon: string }[];
    features: { title: string; description: string; icon: string; color: string }[];
}

interface DataContextType {
    products: (Product & { minimumTier: SellerTier })[];
    setProducts: React.Dispatch<React.SetStateAction<(Product & { minimumTier: SellerTier })[]>>;
    landingContent: LandingContent;
    setLandingContent: React.Dispatch<React.SetStateAction<LandingContent>>;
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    exchangeRate: number;
    setExchangeRate: (rate: number) => void;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    payouts: Payout[];
    setPayouts: React.Dispatch<React.SetStateAction<Payout[]>>;
    analytics: AnalyticsEvent[];
    setAnalytics: React.Dispatch<React.SetStateAction<AnalyticsEvent[]>>;
    contests: Contest[];
    setContests: React.Dispatch<React.SetStateAction<Contest[]>>;
    leaderboard: LeaderboardEntry[];
    blogs: BlogItem[];
    globalCommission: number;
    setGlobalCommission: (rate: number) => void;
    minPayoutThreshold: number;
    setMinPayoutThreshold: (val: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<(Product & { minimumTier: SellerTier })[]>(() => {
        const saved = localStorage.getItem("system_products");
        if (saved) return JSON.parse(saved);
        return initialProducts.map((p, i) => ({
            ...p,
            minimumTier: i === 0 ? "Basic" : i === 1 ? "Standard" : "Pro",
        }));
    });

    const [landingContent, setLandingContent] = useState<LandingContent>({
        heroTitle: "Build your dream business with Africa's #1 Affiliate Hub.",
        heroSubtitle: "Join 10,000+ partners growing their income with our easy-to-use platform.",
        stats: [
            { label: "Active Partners", value: "12,842", icon: "Users" },
            { label: "Total Paid Out", value: "$4.2M+", icon: "TrendingUp" },
            { label: "Global Reach", value: "142", icon: "Globe" },
            { label: "Platform Uptime", value: "99.9%", icon: "ShieldCheck" }
        ],
        features: [
            { title: "Simple Sales Tracking", description: "Easy and accurate tracking for every referral you make.", icon: "Layers", color: "bg-blue-500/10 text-blue-500" },
            { title: "Fast Payments", description: "Get your earnings quickly through secure, verified channels.", icon: "Zap", color: "bg-amber-500/10 text-amber-500" },
            { title: "Marketplace Access", description: "Access high-quality products and marketing materials.", icon: "BarChart3", color: "bg-emerald-500/10 text-emerald-500" },
            { title: "Priority Support", description: "Direct help and support to help you scale your business.", icon: "Users", color: "bg-primary/10 text-primary" }
        ]
    });

    const [packages, setPackages] = useState<Package[]>([
        { name: "Basic", price: 50, commission: 40, payoutSchedule: "Monthly (30th)" },
        { name: "Standard", price: 150, commission: 50, payoutSchedule: "Bi-Weekly (15th/30th)" },
        { name: "Pro", price: 500, commission: 60, payoutSchedule: "Weekly (Every Friday)" }
    ]);

    const [exchangeRate, setExchangeRate] = useState(12.5);
    const [globalCommission, setGlobalCommission] = useState(40);
    const [minPayoutThreshold, setMinPayoutThreshold] = useState(50);

    const [users, setUsers] = useState<User[]>([
        { id: "1", name: "Kweku Cee", email: "kweku@reign.com", username: "kweku_ceo", role: "ADMIN", status: "ACTIVE", earnings: 12540, clicks: 85200, conversions: 3200, packageTier: "Pro", joinedDate: "2024-01-15", performanceScore: 98 },
        { id: "2", name: "Ama Serwaa", email: "ama@affiliate.com", username: "ama_serwaa", role: "AFFILIATE", status: "PENDING", earnings: 0, clicks: 0, conversions: 0, packageTier: "Standard", joinedDate: "2024-04-01", performanceScore: 0 },
        { id: "3", name: "John Doe", email: "john@doe.com", username: "johndoe", role: "AFFILIATE", status: "ACTIVE", earnings: 450, clicks: 1200, conversions: 45, packageTier: "Basic", joinedDate: "2024-02-20", performanceScore: 72 },
    ]);

    const [payouts, setPayouts] = useState<Payout[]>([
        { id: "P1", userId: "1", userName: "Kweku Cee", amount: 2500, method: "Bank Transfer", status: "PROCESSED", date: "2024-03-30", invoiceId: "INV-001" },
        { id: "P2", userId: "3", userName: "John Doe", amount: 150, method: "PayPal", status: "PENDING", date: "2024-04-05", invoiceId: "INV-002" },
    ]);

    const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([
        { id: "E1", type: "CLICK", affiliateId: "1", productId: "P1", timestamp: new Date().toISOString(), ip: "192.168.1.1", geo: "Ghana", device: "DESKTOP" },
        { id: "E2", type: "CONVERSION", affiliateId: "1", productId: "P1", timestamp: new Date().toISOString(), ip: "41.215.160.5", geo: "Nigeria", device: "MOBILE", amount: 150 },
    ]);

    const [contests, setContests] = useState<Contest[]>([
        { id: "C1", title: "Top Performer Contest", description: "First to 1,000 sales receives a high-end gaming laptop.", target: 1000, reward: 2500, startDate: "2024-04-01", endDate: "2024-05-01", participants: 450, status: "ACTIVE" },
        { id: "C2", title: "Monthly Sales Sprint", description: "Top 5 earners this month receive a 10% commission bonus.", target: 10000, reward: 5000, startDate: "2024-04-15", endDate: "2024-06-30", participants: 120, status: "ACTIVE" }
    ]);

    const leaderboard: LeaderboardEntry[] = [
        { rank: 1, name: "Satoshi Nakamoto", earnings: 142500, conversions: 12400, tier: "Pro" },
        { rank: 2, name: "Vitalik Buterin", earnings: 98400, conversions: 8200, tier: "Pro" },
        { rank: 3, name: "Brian Armstrong", earnings: 72100, conversions: 5400, tier: "Standard" },
        { rank: 4, name: "Kweku Cee", earnings: 12540, conversions: 3200, tier: "Pro" },
        { rank: 5, name: "Ama Serwaa", earnings: 4200, conversions: 110, tier: "Standard" },
    ];

    const blogs: BlogItem[] = [
        { id: "1", title: "How to Track Your Sales", excerpt: "Learn how our tracking system helps you see your earnings in real-time.", author: "James Wilson", date: "April 02, 2024", category: "Guides", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80" },
        { id: "2", title: "Growing Your Affiliate Business", excerpt: "Expert tips on how to reach more customers and increase your sales.", author: "Sarah Jones", date: "April 04, 2024", category: "Strategy", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" }
    ];

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch("https://open.er-api.com/v6/latest/USD");
                const data = await response.json();
                if (data && data.rates && data.rates.GHS) {
                    setExchangeRate(data.rates.GHS);
                    console.log("Exchange rate updated:", data.rates.GHS);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate:", error);
            }
        };

        fetchExchangeRate();
        const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000); // Update every 30 minutes

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem("system_products", JSON.stringify(products));
    }, [products]);

    return (
        <DataContext.Provider value={{
            products, setProducts,
            landingContent, setLandingContent,
            packages, setPackages,
            exchangeRate, setExchangeRate,
            users, setUsers,
            payouts, setPayouts,
            analytics, setAnalytics,
            contests, setContests,
            leaderboard,
            blogs,
            globalCommission, setGlobalCommission,
            minPayoutThreshold, setMinPayoutThreshold
        }}>
            {children}
        </DataContext.Provider>
    );
};
