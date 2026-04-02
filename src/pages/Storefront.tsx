import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import PurchaseModal from "@/components/PurchaseModal";
import { products, Product } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

const categories = ["All", "E-books", "Software", "Courses"] as const;

const Storefront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {refId && (
        <div className="bg-primary/5 border-b border-primary/10 py-2 text-center text-sm text-primary font-medium">
          👉 You're shopping via affiliate referral link
        </div>
      )}

      <div className="container mx-auto flex gap-8 px-4 py-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-60 shrink-0 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Price Range</h3>
            <Slider
              min={0}
              max={200}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-2"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₵{priceRange[0]}</span>
              <span>₵{priceRange[1]}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-2xl font-bold text-foreground"
          >
            Digital Products
          </motion.h1>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} onBuy={setSelectedProduct} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>

      <PurchaseModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Storefront;
