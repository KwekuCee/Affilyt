import { useState } from "react";
import { DollarSign, Target, Percent, Package } from "lucide-react";

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
                        <p className="text-muted-foreground mt-2 text-sm">Visualize your monthly scale based on your affiliate tier and product sales.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-display"><Target className="w-4 h-4" /> Monthly Sales</label>
                                <span className="font-black text-lg">{sales.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="5" max="500" step="5"
                                value={sales} onChange={(e) => setSales(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 font-display"><Percent className="w-4 h-4" /> Commission Split</label>
                                <span className="font-black text-lg text-primary">{commissionSplit}% Per Sale</span>
                            </div>
                            <div className="flex bg-secondary p-1 rounded-xl">
                                {["Basic", "Standard", "Pro"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTier(t as any)}
                                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${tier === t ? 'bg-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t} Platoon
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="w-full aspect-square max-w-sm rounded-[3rem] bg-background/50 border border-white/5 flex flex-col items-center justify-center p-8 text-center glass-primary shadow-glow">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Target Monthly Take</p>
                        <p className="text-6xl font-display font-black text-gradient tabular-nums tracking-tighter">${potentialEarnings.toLocaleString()}</p>
                        <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Based on {sales} direct sales</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
