import { useState, useEffect } from "react";
import { Star, TrendingUp, LinkIcon, Copy, Check, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import useEmblaCarousel from "embla-carousel-react";

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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi]);

    // Auto-play
    useEffect(() => {
        if (!emblaApi) return;
        const interval = setInterval(() => emblaApi.scrollNext(), 5000);
        return () => clearInterval(interval);
    }, [emblaApi]);

    const generateLink = (product: typeof topProducts[0]) => {
        const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
        const link = `${window.location.origin}/marketplace?ref=${refId}&product=${product.id}`;
        navigator.clipboard.writeText(link);
        setCopiedId(product.id);
        toast({ title: "Link Generated & Copied!", description: product.title });
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Top Performers</h2>
                    <p className="text-muted-foreground font-medium">Your highest-earning products with one-click link generation.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl"
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollPrev}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl"
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollNext}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {topProducts.map((product, i) => (
                        <div
                            key={product.id}
                            className="flex-none w-[320px] group"
                        >
                            <div className="p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border-2 border-border shadow-xl hover:border-primary/30 hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                                {/* Rank Badge */}
                                {i < 3 && (
                                    <div className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm italic ${i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-slate-300 text-slate-800" : "bg-amber-600 text-amber-100"
                                        }`}>
                                        #{i + 1}
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                <h3 className="font-black text-lg text-foreground mb-2 leading-tight">{product.title}</h3>

                                <div className="flex gap-2 mb-4">
                                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black">{product.commission}% rate</Badge>
                                    <Badge className="bg-secondary text-muted-foreground border-none text-[9px] font-black">${product.price}</Badge>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 mb-6 flex-1">
                                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                                        <p className="text-lg font-black text-foreground">${product.earnings.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">Earned</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                                        <p className="text-lg font-black text-foreground">{product.sales}</p>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">Sales</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                                        <p className="text-lg font-black text-foreground">{product.conversionRate}%</p>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase">CVR</p>
                                    </div>
                                </div>

                                {/* Generate Link CTA */}
                                <Button
                                    onClick={() => generateLink(product)}
                                    className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-tight shadow-lg shadow-primary/20"
                                >
                                    {copiedId === product.id ? (
                                        <><Check className="h-4 w-4 mr-2" /> Copied!</>
                                    ) : (
                                        <><LinkIcon className="h-4 w-4 mr-2" /> Generate Link</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats Bar */}
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border-2 border-primary/10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total from Top Products</p>
                        <p className="text-2xl font-black text-foreground">${topProducts.reduce((s, p) => s + p.earnings, 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Star className="h-5 w-5 text-amber-400" />
                    <p className="text-sm font-black text-foreground">
                        Top pick: <span className="text-primary italic">{topProducts[0].title}</span> — {topProducts[0].conversionRate}% CVR
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopProductsCarousel;
