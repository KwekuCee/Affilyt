import { useState } from "react";
import { DollarSign, MousePointerClick, Percent } from "lucide-react";

export const EarningsCalculator = () => {
    const [clicks, setClicks] = useState(1000);
    const [conversionRate, setConversionRate] = useState(5);

    const avgCommission = 25;
    const sales = Math.floor(clicks * (conversionRate / 100));
    const potentialEarnings = sales * avgCommission;

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
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><MousePointerClick className="w-4 h-4" /> Monthly Clicks</label>
                                <span className="font-black text-lg">{clicks.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="100" max="10000" step="100"
                                value={clicks} onChange={(e) => setClicks(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Percent className="w-4 h-4" /> Conversion Rate</label>
                                <span className="font-black text-lg">{conversionRate}%</span>
                            </div>
                            <input
                                type="range" min="1" max="15" step="1"
                                value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
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
