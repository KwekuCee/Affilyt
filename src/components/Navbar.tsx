import { Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span>DigiMarket</span>
        </Link>

        <div className="hidden md:flex relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 rounded-full bg-secondary border-0"
          />
        </div>

        <Link to="/become-seller">
          <Button size="sm" className="rounded-full">Become a Seller</Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
