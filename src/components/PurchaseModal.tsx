import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Check } from "lucide-react";
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

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>

          <img src={product.image} alt={product.title} className="mb-4 h-40 w-full rounded-xl object-cover" />

          <h2 className="text-xl font-bold text-foreground">{product.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

          <ul className="mt-4 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-success" />
                {f}
              </li>
            ))}
          </ul>

          {refId && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-primary">
              👉 You are buying via <span className="font-semibold">Affiliate #{refId}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Secure Checkout
            </div>
            <span className="text-2xl font-bold text-foreground">₵{product.price}</span>
          </div>

          <Button className="mt-4 w-full rounded-full" size="lg" onClick={onClose}>
            Proceed to Checkout
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseModal;
