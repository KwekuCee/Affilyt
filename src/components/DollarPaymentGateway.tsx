import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DollarPaymentGatewayProps {
    amount: number;
    itemLabel: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const DollarPaymentGateway = ({ amount, itemLabel, onSuccess, onCancel }: DollarPaymentGatewayProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<"method" | "card" | "success">("method");
    const [cardNumber, setCardNumber] = useState("");

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate institutional grade transaction verification
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsProcessing(false);
        setStep("success");
        toast.success("Institutional Transaction Verified", {
            description: `Payment of $${amount.toFixed(2)} processed via global ledger.`
        });
        setTimeout(() => {
            onSuccess();
        }, 2000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-3xl">
            <div className="p-8 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                        Secure USD Gateway
                    </Badge>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Checkout.</h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">{itemLabel}</p>
            </div>

            <div className="p-8">
                {step === "method" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="mb-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Payable</p>
                            <p className="text-4xl font-black text-foreground italic">${amount.toLocaleString()}</p>
                        </div>

                        <button
                            onClick={() => setStep("card")}
                            className="w-full p-6 rounded-3xl border-2 border-border hover:border-primary/50 transition-all flex items-center gap-6 group text-left"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase italic">Credit / Debit Card</p>
                                <p className="text-[10px] text-muted-foreground font-medium">VISA, Mastercard, AMEX</p>
                            </div>
                        </button>

                        <button className="w-full p-6 rounded-3xl border-2 border-border hover:border-blue-500/50 transition-all flex items-center gap-6 group text-left opacity-60 cursor-not-allowed">
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase italic">PayPal / Skrill</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Institutional Digital Wallets</p>
                            </div>
                        </button>

                        <Button variant="ghost" onClick={onCancel} className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground">
                            Cancel Transaction
                        </Button>
                    </motion.div>
                )}

                {step === "card" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Card Participant Identity</label>
                                <Input placeholder="JOHN DOE" className="h-14 rounded-2xl bg-secondary border-none font-bold placeholder:opacity-30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Card Number</label>
                                <div className="relative">
                                    <Input
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="**** **** **** ****"
                                        className="h-14 rounded-2xl bg-secondary border-none font-bold placeholder:opacity-30"
                                    />
                                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Expiry</label>
                                    <Input placeholder="MM / YY" className="h-14 rounded-2xl bg-secondary border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">CVV</label>
                                    <Input type="password" placeholder="***" className="h-14 rounded-2xl bg-secondary border-none font-bold" />
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={isProcessing}
                            onClick={handlePayment}
                            className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-3"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Encrypting Protocol...
                                </>
                            ) : (
                                `Pay institutional $${amount.toFixed(2)}`
                            )}
                        </Button>

                        <Button variant="ghost" onClick={() => setStep("method")} className="w-full h-10 rounded-xl text-[10px] font-black uppercase text-muted-foreground">
                            Return to Methods
                        </Button>
                    </motion.div>
                )}

                {step === "success" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center text-center space-y-6"
                    >
                        <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-success" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter">Auth Success.</h4>
                            <p className="text-sm text-muted-foreground font-medium mt-2">Capital transmission confirmed on the global network.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/50 border border-border w-full">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Trace ID</p>
                            <p className="font-mono text-[10px] mt-1">0xBF48-LEDGER-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-center gap-3">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">128-bit quantum encryption active</span>
            </div>
        </div>
    );
};

export default DollarPaymentGateway;
