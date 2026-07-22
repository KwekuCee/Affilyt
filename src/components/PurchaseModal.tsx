import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { DBProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import DollarPaymentGateway from "./DollarPaymentGateway";
import { useToast } from "@/hooks/use-toast";

interface PurchaseModalProps {
  product: any | null;
  onClose: () => void;
  affiliateReferral?: { affiliateId?: string; affiliateLinkId?: string; code?: string };
}

const PurchaseModal = ({ product, onClose, affiliateReferral }: PurchaseModalProps) => {
  const [searchParams] = useSearchParams();
  const [showPayment, setShowPayment] = useState(false);
  const refId = searchParams.get("ref");
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Asset Acquisition Complete",
      description: "Check your email for the license keys and institutional documentation.",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`relative w-full ${showPayment ? 'max-w-xl' : 'max-w-md'} rounded-[3rem] border border-border bg-card p-8 shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground z-10">
              <X className="h-5 w-5" />
            </button>

            {!showPayment ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Portfolio Acquisition</p>
                  <h3 className="text-3xl font-black text-foreground italic uppercase mb-2">{product.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-foreground">${Number(product.price).toFixed(2)}</p>
                    <span className="text-sm font-bold text-muted-foreground italic">USD</span>
                  </div>
                </div>

                <div className="space-y-4 border-2 border-border rounded-3xl p-6 mb-6 bg-secondary/20">
                  <div className="flex justify-between text-sm font-black">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black">
                    <span className="text-muted-foreground">Processing (1.5%)</span>
                    <span className="text-foreground">+${(Number(product.price) * 0.015).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div className="flex justify-between text-lg font-black italic">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">${(Number(product.price) * 1.015).toFixed(2)}</span>
                  </div>
                </div>

                {(refId || affiliateReferral?.affiliateId) && product.commission_rate ? (
                  <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Referral attribution</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          This purchase supports affiliate <code className="font-mono text-xs">{refId || affiliateReferral?.code}</code>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimated commission earned:{" "}
                          <b className="text-primary">
                            ${((Number(product.price) * Number(product.commission_rate)) / 100).toFixed(2)}
                          </b>{" "}
                          ({product.commission_rate}% of subtotal)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <Button className="w-full rounded-2xl bg-primary text-white h-16 text-xs font-black uppercase tracking-widest gap-2 mb-4 shadow-xl shadow-primary/20" onClick={() => setShowPayment(true)}>
                  Proceed to Secure Gateway <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Institutional Escrow Transparency
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <DollarPaymentGateway
                  amount={Number(product.price) * 1.015}
                  itemLabel={product.title}
                  productId={product.id}
                  affiliateId={affiliateReferral?.affiliateId || refId || undefined}
                  affiliateLinkId={affiliateReferral?.affiliateLinkId}
                  buyerEmail=""
                  onSuccess={handleSuccess}
                  onCancel={() => setShowPayment(false)}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;
