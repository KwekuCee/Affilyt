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
        heroSubtitle: "Join 10,000+ entrepreneurs scaling digital empires through our institutional-grade infrastructure.",
        stats: [
            { label: "Active Nodes", value: "12,842", icon: "Users" },
            { label: "Total Inflow", value: "$4.2M+", icon: "TrendingUp" },
            { label: "Global Reach", value: "142", icon: "Globe" },
            { label: "Uptime Protocol", value: "99.9%", icon: "ShieldCheck" }
        ],
        features: [
            { title: "Institutional Ledger", description: "Verifiable, low-latency tracking for every referral node in your network.", icon: "Layers", color: "bg-blue-500/10 text-blue-500" },
            { title: "Velocity Payouts", description: "Automated distribution of capital through secure, verified channels.", icon: "Zap", color: "bg-amber-500/10 text-amber-500" },
            { title: "Market Alpha", description: "Access proprietary market intelligence and high-yield digital assets.", icon: "BarChart3", color: "bg-emerald-500/10 text-emerald-500" },
            { title: "Elite Relay", description: "Direct executive support for high-performance scaling operations.", icon: "Users", color: "bg-primary/10 text-primary" }
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
            globalCommission, setGlobalCommission,
            minPayoutThreshold, setMinPayoutThreshold
        }}>
            {children}
        </DataContext.Provider>
    );
};
