import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Check, Sparkles } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface PurchaseModalProps {
  product: Product | null;
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
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-4 w-4" />
            </button>

            <img src={product.image} alt={product.title} className="mb-5 h-44 w-full rounded-2xl object-cover" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">{product.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
              </div>
              <span className="shrink-0 text-2xl font-extrabold text-foreground">₵{product.price}</span>
            </div>

            <ul className="mt-5 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {refId && (
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Purchasing via <span className="font-bold">Affiliate #{refId}</span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Secure Checkout
              </div>
            </div>

            <Button className="mt-4 w-full rounded-full gradient-btn border-0 h-12 text-base font-semibold" onClick={onClose}>
              Proceed to Checkout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;
