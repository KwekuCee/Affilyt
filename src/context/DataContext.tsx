import React, { createContext, useContext, useState, useEffect } from "react";

export type VendorTier = "Basic" | "Standard" | "Pro";
export type UserRole = "ADMIN" | "MANAGER" | "AFFILIATE" | "SUB_AFFILIATE";
export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "ARCHIVED";

export interface Package {
    name: VendorTier;
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
    landingContent: LandingContent;
    setLandingContent: React.Dispatch<React.SetStateAction<LandingContent>>;
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    exchangeRate: number;
    setExchangeRate: (rate: number) => void;
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
    const [landingContent, setLandingContent] = useState<LandingContent>({
        heroTitle: "Build your dream business with Africa's #1 Affiliate Hub.",
        heroSubtitle: "Join thousands of partners growing their income with our easy-to-use platform.",
        stats: [
            { label: "Active Partners", value: "1,200+", icon: "Users" },
            { label: "Total Paid Out", value: "$120K+", icon: "TrendingUp" },
            { label: "Countries", value: "15+", icon: "Globe" },
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
        { name: "Basic", price: 10, commission: 35, payoutSchedule: "Monthly (30th)" },
        { name: "Standard", price: 19, commission: 50, payoutSchedule: "Bi-Weekly (15th/30th)" },
        { name: "Pro", price: 30, commission: 60, payoutSchedule: "Weekly (Every Friday)" }
    ]);

    const [exchangeRate, setExchangeRate] = useState(12.5);
    const [globalCommission, setGlobalCommission] = useState(40);
    const [minPayoutThreshold, setMinPayoutThreshold] = useState(50);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch("https://open.er-api.com/v6/latest/USD");
                const data = await response.json();
                if (data && data.rates && data.rates.GHS) {
                    setExchangeRate(data.rates.GHS);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate:", error);
            }
        };
        fetchExchangeRate();
        const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DataContext.Provider value={{
            landingContent, setLandingContent,
            packages, setPackages,
            exchangeRate, setExchangeRate,
            globalCommission, setGlobalCommission,
            minPayoutThreshold, setMinPayoutThreshold
        }}>
            {children}
        </DataContext.Provider>
    );
};
