import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface DisplayProduct {
  id: string;
  title: string;
  price: number;
  description?: string | null;
  category: string;
  image?: string;
  image_url?: string | null;
  commission_rate?: number;
}

interface Props {
  product: DisplayProduct;
  onBuy: (p: DisplayProduct) => void;
  index: number;
}

const ProductCard = React.forwardRef<HTMLDivElement, Props>(({ product, onBuy, index }, ref) => {
  const img = product.image_url || product.image;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-elevated transition-all flex flex-col"
    >
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        {img ? (
          <img src={img} alt={product.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full" />
        )}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-background/90 backdrop-blur text-foreground border border-border">
          {product.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-base leading-snug mb-1.5 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-bold tabular">${Number(product.price).toFixed(2)}</p>
            {product.commission_rate && <p className="text-xs text-primary font-medium">{product.commission_rate}% commission</p>}
          </div>
          <Button onClick={() => onBuy(product)} size="sm" className="gap-1.5">
            Buy <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
