import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  index: number;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(({ product, onBuy, index }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group card-shine overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/20"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {product.category}
          </span>
          <span className="text-lg font-extrabold text-foreground">₵{product.price}</span>
        </div>
        <h3 className="mb-1.5 text-base font-bold text-foreground leading-snug">{product.title}</h3>
        <p className="mb-5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
        <Button onClick={() => onBuy(product)} className="w-full rounded-full gradient-btn border-0 gap-2 group/btn" size="sm">
          Buy Now
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
