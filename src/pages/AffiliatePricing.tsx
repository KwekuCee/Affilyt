import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { NetworkBackground } from "@/components/landing/NetworkBackground";

const AffiliatePricing = () => {
    const { packages } = useData();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <LandingNavbar />

            <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                <NetworkBackground />
                <div className="bg-blob bg-blob-1 opacity-20" />
                <div className="bg-blob bg-blob-2 opacity-10" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">Affiliate Programs</Badge>
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">Choose your hunting ground.</h1>
                        <p className="text-xl text-muted-foreground">Select a tier to start promoting Africa's top digital products.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {packages.map((pkg) => {
                            const popular = pkg.name === "Standard";
                            return (
                                <div key={pkg.name} className={`relative p-8 rounded-3xl border-2 glass-subtle flex flex-col ${popular ? "border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)] bg-primary/5" : "border-white/10"}`}>
                                    {popular && <Badge className="absolute -top-3 left-8 px-3 py-1 shadow-lg">Most popular</Badge>}
                                    <h3 className="font-display text-2xl font-bold mb-2">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="font-display text-5xl font-black tabular-nums">${pkg.price}</span>
                                        <span className="text-muted-foreground">/year</span>
                                    </div>
                                    <p className="text-sm font-medium text-primary mb-8">{pkg.commission}% commission limit per sale.</p>

                                    <ul className="space-y-4 mb-10 flex-1">
                                        {[`${pkg.commission}% recurring commission cap`, pkg.name === "Pro" ? "Instant Korapay Payouts" : pkg.name === "Standard" ? "Weekly Payouts" : "Monthly Payouts", "Full marketing assets access", "Leaderboard participation"].map((f) => (
                                            <li key={f} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium text-muted-foreground">{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link to={`/become-affiliate?plan=${pkg.name}`} className="block w-full mt-auto">
                                        <Button className="w-full h-14 text-sm font-bold tracking-wider" variant={popular ? "default" : "outline"}>
                                            Start with {pkg.name} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Korapay checkout</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AffiliatePricing;
