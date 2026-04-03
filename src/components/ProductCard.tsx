import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  index: number;
}

const categoryColors: Record<string, string> = {
  "Courses": "bg-primary text-primary-foreground",
  "Software": "bg-primary text-primary-foreground",
  "E-books": "bg-primary text-primary-foreground",
};

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(({ product, onBuy, index }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[product.category] || "bg-primary text-primary-foreground"}`}>
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-foreground leading-snug mb-1">{product.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Investment</p>
            <p className="text-lg font-black text-foreground">${product.price.toFixed(2)}</p>
          </div>
          <Button
            onClick={() => onBuy(product)}
            size="sm"
            className="rounded-lg bg-primary text-primary-foreground text-xs font-bold gap-1 h-9 px-4"
          >
            Buy Now <Zap className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
