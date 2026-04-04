import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "PUBLIC_VISITOR" | "AFFILIATE" | "SUPERADMIN";
export type SellerTier = "Basic" | "Standard" | "Pro";

export interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  status: "Pending" | "Completed" | "Failed";
  method: "Skrill";
  email: string;
}

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  affiliateId: string;
  affiliateName: string;
  packageType: SellerTier | null;
  setPackageType: (tier: SellerTier | null) => void;
  affiliateLink: string | null;
  setAffiliateLink: (link: string | null) => void;
  earnings: number;
  setEarnings: React.Dispatch<React.SetStateAction<number>>;
  withdrawals: Withdrawal[];
  setWithdrawals: React.Dispatch<React.SetStateAction<Withdrawal[]>>;
  dark: boolean;
  toggleDark: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("PUBLIC_VISITOR");
  const [packageType, setPackageType] = useState<SellerTier | null>(() => {
    return localStorage.getItem("user_package") as SellerTier | null;
  });
  const [affiliateLink, setAffiliateLink] = useState<string | null>(() => {
    return localStorage.getItem("user_afflink");
  });
  const [earnings, setEarnings] = useState<number>(() => {
    return Number(localStorage.getItem("user_earnings") || "0");
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem("user_withdrawals");
    return saved ? JSON.parse(saved) : [];
  });

  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (packageType) localStorage.setItem("user_package", packageType);
    if (affiliateLink) localStorage.setItem("user_afflink", affiliateLink);
    localStorage.setItem("user_earnings", earnings.toString());
    localStorage.setItem("user_withdrawals", JSON.stringify(withdrawals));
  }, [packageType, affiliateLink, earnings, withdrawals]);

  const toggleDark = () => setDark((v) => !v);

  return (
    <AuthContext.Provider value={{
      role,
      setRole,
      affiliateId: "aff_demo_123",
      affiliateName: "Demo Affiliate",
      packageType,
      setPackageType,
      affiliateLink,
      setAffiliateLink,
      earnings,
      setEarnings,
      withdrawals,
      setWithdrawals,
      dark,
      toggleDark
    }}>
      {children}
    </AuthContext.Provider>
  );
};
