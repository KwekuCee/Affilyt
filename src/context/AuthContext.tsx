import React, { createContext, useContext, useState } from "react";

export type UserRole = "PUBLIC_VISITOR" | "AFFILIATE" | "SUPERADMIN";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  affiliateId: string;
  affiliateName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("PUBLIC_VISITOR");

  return (
    <AuthContext.Provider value={{ role, setRole, affiliateId: "aff_demo_123", affiliateName: "Demo Affiliate" }}>
      {children}
    </AuthContext.Provider>
  );
};
