import { useState } from "react";
import { DollarSign, MousePointerClick, Percent, Package } from "lucide-react";

export const EarningsCalculator = () => {
    const [sales, setSales] = useState(50);
    const [tier, setTier] = useState<"Basic" | "Standard" | "Pro">("Standard");

    const commissionRates = { Basic: 25, Standard: 35, Pro: 50 };
    const avgProductValue = 100; // Assume $100 avg product price
    const commissionSplit = commissionRates[tier];

    const potentialEarnings = sales * (avgProductValue * (commissionSplit / 100));

    return (
        <div className="w-full max-w-4xl mx-auto p-8 rounded-[2rem] glass-subtle border-dashed shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <DollarSign className="w-40 h-40" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Earnings Simulator</h3>
                        <h2 className="text-3xl font-display font-bold">Calculate your hunt.</h2>
                        <p className="text-muted-foreground mt-2 text-sm">Drag the sliders to see how much you could earn with an average $25 commission per sale.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><MousePointerClick className="w-4 h-4" /> Monthly Sales</label>
                                <span className="font-black text-lg">{sales.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="10" max="1000" step="10"
                                value={sales} onChange={(e) => setSales(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Package className="w-4 h-4" /> Affiliate Package</label>
                                <span className="font-black text-lg text-primary">{tier}</span>
                            </div>
                            <div className="flex bg-secondary p-1 rounded-xl">
                                {["Basic", "Standard", "Pro"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTier(t as any)}
                                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${tier === t ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t} ({commissionRates[t as keyof typeof commissionRates]}%)
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="w-full aspect-square max-w-sm rounded-[3rem] bg-background/50 border border-white/5 flex flex-col items-center justify-center p-8 text-center glass-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Estimated Monthly Output</p>
                        <p className="text-6xl font-display font-black text-gradient tabular-nums">${potentialEarnings.toLocaleString()}</p>
                        <p className="mt-4 text-xs font-medium text-muted-foreground">Based on {sales} estimated sales.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
