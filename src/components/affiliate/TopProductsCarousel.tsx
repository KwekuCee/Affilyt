import { useState, useEffect } from "react";
import { Star, TrendingUp, LinkIcon, Copy, Check, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Mock top performing products
const topProducts = [
    { id: "p1", title: "Digital Marketing Mastery", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop", price: 97, commission: 30, earnings: 2910, sales: 100, conversionRate: 4.5 },
    { id: "p2", title: "Premium Fitness Tracker", image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=240&fit=crop", price: 149, commission: 20, earnings: 1788, sales: 60, conversionRate: 3.2 },
    { id: "p3", title: "E-Book Bundle: 50 Titles", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=240&fit=crop", price: 29, commission: 50, earnings: 1450, sales: 100, conversionRate: 6.5 },
    { id: "p4", title: "Wireless Noise-Cancel Buds", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=240&fit=crop", price: 199, commission: 15, earnings: 1194, sales: 40, conversionRate: 2.8 },
    { id: "p5", title: "Online Cooking Academy", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop", price: 59, commission: 35, earnings: 1033, sales: 50, conversionRate: 5.1 },
    { id: "p6", title: "Smart Home Starter Kit", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=240&fit=crop", price: 249, commission: 12, earnings: 897, sales: 30, conversionRate: 2.1 },
    { id: "p7", title: "Photography Presets Pack", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=240&fit=crop", price: 39, commission: 40, earnings: 780, sales: 50, conversionRate: 7.2 },
    { id: "p8", title: "Language Learning App Pro", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=240&fit=crop", price: 79, commission: 25, earnings: 592, sales: 30, conversionRate: 3.9 },
];

const TopProductsCarousel = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    // Responsive items per view
    useEffect(() => {
        const updateView = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(1);
            else if (w < 1024) setItemsPerView(2);
            else setItemsPerView(3);
        };
        updateView();
        window.addEventListener("resize", updateView);
        return () => window.removeEventListener("resize", updateView);
    }, []);

    const maxIndex = Math.max(0, topProducts.length - itemsPerView);

    const generateLink = (product: typeof topProducts[0]) => {
        const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
        const link = `${window.location.origin}/marketplace?ref=${refId}&product=${product.id}`;
        navigator.clipboard.writeText(link);
        setCopiedId(product.id);
        toast({ title: "Link Generated & Copied!", description: product.title });
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Top Products</h2>
                    <p className="text-sm text-muted-foreground mt-1">Highest-earning products with one-click link generation.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline" size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
                        disabled={currentIndex >= maxIndex}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden">
                <div
                    className="flex gap-4 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {topProducts.map((product, i) => (
                        <div
                            key={product.id}
                            className="shrink-0"
                            style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                        >
                            <div className="p-4 sm:p-5 rounded-2xl glass hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                                {/* Rank Badge */}
                                {i < 3 && (
                                    <div className={`absolute top-3 right-3 z-10 h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-slate-300 text-slate-800" : "bg-amber-600 text-amber-100"
                                        }`}>
                                        #{i + 1}
                                    </div>
                                )}

                                {/* Image */}
                                <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden mb-3">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <h3 className="font-semibold text-sm text-foreground mb-2 leading-snug">{product.title}</h3>

                                <div className="flex gap-1.5 mb-3">
                                    <Badge variant="secondary" className="text-[10px]">{product.commission}% rate</Badge>
                                    <Badge variant="outline" className="text-[10px]">${product.price}</Badge>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                                    <div className="p-2 rounded-lg bg-secondary/50 text-center">
                                        <p className="text-sm font-bold text-foreground">${product.earnings.toLocaleString()}</p>
                                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Earned</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-secondary/50 text-center">
                                        <p className="text-sm font-bold text-foreground">{product.sales}</p>
                                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Sales</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-secondary/50 text-center">
                                        <p className="text-sm font-bold text-foreground">{product.conversionRate}%</p>
                                        <p className="text-[9px] font-medium text-muted-foreground uppercase">CVR</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => generateLink(product)}
                                    className="w-full h-9 rounded-xl font-semibold text-xs"
                                    size="sm"
                                >
                                    {copiedId === product.id ? (
                                        <><Check className="h-3.5 w-3.5 mr-1.5" /> Copied!</>
                                    ) : (
                                        <><LinkIcon className="h-3.5 w-3.5 mr-1.5" /> Generate Link</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Bar */}
            <div className="p-4 sm:p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total from Top Products</p>
                        <p className="text-lg font-bold text-foreground">${topProducts.reduce((s, p) => s + p.earnings, 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <p className="text-xs font-medium text-foreground">
                        Top: <span className="text-primary">{topProducts[0].title}</span> — {topProducts[0].conversionRate}% CVR
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopProductsCarousel;
