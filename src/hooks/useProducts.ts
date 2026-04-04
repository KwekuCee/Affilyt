import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DBProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  features: string[];
  commission_rate: number;
  epc: number | null;
  conversion_rate: number | null;
  trust_score: number | null;
  refund_rate: number | null;
  status: string;
  created_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<DBProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};
