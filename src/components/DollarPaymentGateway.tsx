import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle2, Loader2, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useData } from "@/context/DataContext";

const KORAPAY_PUBLIC_KEY = "pk_live_AAZBw2DtmnyrGHfDJmNqkE4dKhw9gKQHVbz8Gds5";

interface DollarPaymentGatewayProps {
  amount: number;
  itemLabel: string;
  onSuccess: () => void;
  onCancel: () => void;
  productId?: string;
  affiliateId?: string;
  affiliateLinkId?: string;
  buyerEmail?: string;
}

declare global {
  interface Window {
    Korapay: {
      initialize: (config: Record<string, unknown>) => void;
    };
  }
}

const DollarPaymentGateway = ({
  amount,
  itemLabel,
  onSuccess,
  onCancel,
  productId,
  affiliateId,
  affiliateLinkId,
  buyerEmail,
}: DollarPaymentGatewayProps) => {
  const [step, setStep] = useState<"ready" | "processing" | "success" | "failed">("ready");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src*="korapay-collections"]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const generateReference = () => {
    return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("korapay-verify", {
        body: { reference },
      });
      if (error) throw error;
      return data?.success === true;
    } catch (err) {
      console.error("Verification error:", err);
      return false;
    }
  };

  const { exchangeRate } = useData();

  const handlePay = () => {
    if (!scriptLoaded || !window.Korapay) {
      toast.error("Payment gateway is loading, please try again.");
      return;
    }

    const reference = generateReference();
    const ghsAmount = Number((amount * exchangeRate).toFixed(2));
    setStep("processing");

    window.Korapay.initialize({
      key: KORAPAY_PUBLIC_KEY,
      reference,
      amount: ghsAmount,
      currency: "GHS",
      customer: {
        name: buyerEmail ? buyerEmail.split("@")[0] : "Customer",
        email: buyerEmail || "customer@example.com",
      },
      metadata: {
        product_id: productId,
        affiliate_id: affiliateId,
        affiliate_link_id: affiliateLinkId,
        buyer_email: buyerEmail,
        usd_amount: amount,
        exchange_rate: exchangeRate,
      },
      notification_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/korapay-verify`,
      onClose: () => {
        if (step !== "success") {
          setStep("ready");
        }
      },
      onSuccess: async (data: Record<string, unknown>) => {
        const verified = await verifyPayment(reference);
        if (verified) {
          setStep("success");
          toast.success("Payment Verified", {
            description: `$${amount.toFixed(2)} processed successfully.`,
          });
          setTimeout(() => onSuccess(), 2000);
        } else {
          setStep("failed");
          toast.error("Verification failed. Contact support.");
        }
      },
      onFailed: () => {
        setStep("failed");
        toast.error("Payment failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-3xl">
      <div className="p-8 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
            Korapay Secure Gateway
          </Badge>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Checkout.</h3>
        <p className="text-xs text-muted-foreground font-medium mt-1">{itemLabel}</p>
      </div>

      <div className="p-8">
        {step === "ready" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Payable</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-black text-foreground italic">${amount.toFixed(2)}</p>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">GHS Equivalent</span>
                  <span className="text-xs font-black text-primary/80">₵{(amount * exchangeRate).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-black uppercase">Card, Bank Transfer, Mobile Money</p>
                  <p className="text-[10px] text-muted-foreground">All payment methods supported via Korapay</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={!scriptLoaded}
              className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-3"
            >
              {!scriptLoaded ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Loading Gateway...</>
              ) : (
                <><Wallet className="h-5 w-5" /> Pay ${amount.toFixed(2)} Now</>
              )}
            </Button>

            <Button variant="ghost" onClick={onCancel} className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground">
              Cancel Transaction
            </Button>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center text-center space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div>
              <h4 className="text-xl font-black italic uppercase tracking-tighter">Processing...</h4>
              <p className="text-sm text-muted-foreground font-medium mt-2">Complete payment in the Korapay window.</p>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <div>
              <h4 className="text-2xl font-black italic uppercase tracking-tighter">Payment Verified.</h4>
              <p className="text-sm text-muted-foreground font-medium mt-2">Transaction confirmed and recorded.</p>
            </div>
          </motion.div>
        )}

        {step === "failed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldCheck className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <h4 className="text-2xl font-black italic uppercase tracking-tighter">Payment Failed.</h4>
              <p className="text-sm text-muted-foreground font-medium mt-2">Please try again or use a different method.</p>
            </div>
            <Button onClick={() => setStep("ready")} className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest">
              Retry Payment
            </Button>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-center gap-3">
        <ShieldCheck className="h-4 w-4 text-success" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Powered by Korapay • PCI DSS Compliant</span>
      </div>
    </div>
  );
};

export default DollarPaymentGateway;
