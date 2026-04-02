import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  index: number;
}

const ProductCard = ({ product, onBuy, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-medium">{product.category}</Badge>
          <span className="text-lg font-bold text-foreground">₵{product.price}</span>
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">{product.title}</h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <Button onClick={() => onBuy(product)} className="w-full rounded-full" size="sm">
          Buy Now
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
