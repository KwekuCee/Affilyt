import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { DBProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface PurchaseModalProps {
  product: DBProduct | null;
  onClose: () => void;
}

const PurchaseModal = ({ product, onClose }: PurchaseModalProps) => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

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
            className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Acquisition Price</p>
              <p className="text-4xl font-black text-foreground mt-1">${product.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">USD</span></p>
            </div>

            <Button className="w-full rounded-lg bg-primary text-primary-foreground h-12 text-sm font-bold gap-2 mb-3" onClick={onClose}>
              Buy Asset Now <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="space-y-2.5 border-t border-border pt-4 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Escrow Fee (1.5%)</span>
                <span className="text-foreground font-medium">+${(product.price * 0.015).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Technical Audit</span>
                <span className="text-success font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-border pt-2.5">
                <span className="text-foreground">Total Estimate</span>
                <span className="text-foreground">${(product.price * 1.015).toFixed(2)}</span>
              </div>
            </div>

            {refId && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/5 border border-success/20 px-4 py-3 text-sm font-medium text-success">
                <Check className="h-4 w-4" />
                Referral active — buying via affiliate for priority support
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              All transactions protected by institutional-grade escrow
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;
