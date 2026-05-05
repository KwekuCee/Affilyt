import { useState } from "react";
import {
    Users, Copy, Check, Gift, Share2, ExternalLink,
    UserPlus, Trophy, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const bonusTiers = [
    { min: 1, max: 4, bonus: 5, label: "Starter" },
    { min: 5, max: 9, bonus: 10, label: "Connector" },
    { min: 10, max: 24, bonus: 15, label: "Networker" },
    { min: 25, max: Infinity, bonus: 25, label: "Ambassador" },
];

const mockReferrals = [
    { id: "ref1", name: "Kofi A.", status: "active", joinedDate: "2026-04-28", bonusEarned: 10, totalSales: 12 },
    { id: "ref2", name: "Ama K.", status: "active", joinedDate: "2026-04-15", bonusEarned: 10, totalSales: 8 },
    { id: "ref3", name: "Yaw M.", status: "active", joinedDate: "2026-03-20", bonusEarned: 5, totalSales: 22 },
    { id: "ref4", name: "Abena S.", status: "pending", joinedDate: "2026-05-01", bonusEarned: 0, totalSales: 0 },
    { id: "ref5", name: "Kwame D.", status: "active", joinedDate: "2026-02-14", bonusEarned: 5, totalSales: 15 },
    { id: "ref6", name: "Efua T.", status: "inactive", joinedDate: "2026-01-10", bonusEarned: 5, totalSales: 2 },
];

const ReferralProgram = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const refCode = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
    const referralLink = `${window.location.origin}/become-affiliate?invite=${refCode}`;

    const totalReferrals = mockReferrals.length;
    const activeReferrals = mockReferrals.filter(r => r.status === "active").length;
    const totalBonus = mockReferrals.reduce((s, r) => s + r.bonusEarned, 0);

    // Current tier
    const currentTier = bonusTiers.find(t => totalReferrals >= t.min && totalReferrals <= t.max) || bonusTiers[0];
    const nextTier = bonusTiers.find(t => t.min > totalReferrals);
    const progressToNext = nextTier ? ((totalReferrals - currentTier.min + 1) / (nextTier.min - currentTier.min)) * 100 : 100;

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast({ title: "Referral link copied!", description: "Share it and earn bonuses!" });
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOn = (platform: string) => {
        const text = encodeURIComponent(`Join me on Affilyt and start earning! 🚀 Sign up here: ${referralLink}`);
        const urls: Record<string, string> = {
            whatsapp: `https://wa.me/?text=${text}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`,
        };
        window.open(urls[platform], "_blank");
    };

    const statusConfig: Record<string, { color: string; bg: string }> = {
        active: { color: "text-primary", bg: "bg-primary/10" },
        pending: { color: "text-amber-500", bg: "bg-amber-500/10" },
        inactive: { color: "text-muted-foreground", bg: "bg-secondary" },
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Recruit Squad</h2>
                    <p className="text-muted-foreground font-medium">Invite friends. Earn bonus cash for every affiliate you bring.</p>
                </div>
                <Users className="h-10 w-10 text-primary" />
            </div>

            {/* Referral Link + Share */}
            <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <UserPlus className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Your Invite Link</h3>
                            <p className="text-xs text-muted-foreground font-medium">Share this link to earn ${currentTier.bonus} per signup</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border">
                        <code className="text-xs font-bold text-primary truncate flex-1">{referralLink}</code>
                        <Button onClick={copyLink} size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/20">
                            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Button onClick={copyLink} className="h-12 rounded-2xl font-black text-xs uppercase px-8 shadow-lg shadow-primary/20">
                            {copied ? <><Check className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Link</>}
                        </Button>
                        <Button onClick={() => shareOn("whatsapp")} variant="outline" className="h-12 rounded-2xl font-black text-xs uppercase px-6">
                            <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                        </Button>
                        <Button onClick={() => shareOn("twitter")} variant="outline" className="h-12 rounded-2xl font-black text-xs uppercase px-6">
                            <Share2 className="h-4 w-4 mr-2" /> Twitter
                        </Button>
                        <Button onClick={() => shareOn("telegram")} variant="outline" className="h-12 rounded-2xl font-black text-xs uppercase px-6">
                            <ExternalLink className="h-4 w-4 mr-2" /> Telegram
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats + Tier */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Your Stats</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-secondary/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Total Referrals</p>
                            <p className="text-3xl font-black text-foreground">{totalReferrals}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Active Friends</p>
                            <p className="text-3xl font-black text-primary">{activeReferrals}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Total Bonus Earned</p>
                            <p className="text-3xl font-black text-foreground">${totalBonus}</p>
                        </div>
                    </div>
                </div>

                {/* Bonus Tiers */}
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Bonus Tiers</h3>
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase px-3 py-1 rounded-full">
                            {currentTier.label}
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        {bonusTiers.map((tier, i) => {
                            const isActive = tier.label === currentTier.label;
                            const isCompleted = totalReferrals >= tier.min && tier.max < Infinity ? totalReferrals > tier.max : false;
                            return (
                                <div key={tier.label} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isActive ? "bg-primary/10 border-primary/30 shadow-lg" : isCompleted ? "bg-secondary/30 border-border opacity-60" : "bg-secondary/20 border-transparent"
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isActive ? "bg-primary" : "bg-secondary"}`}>
                                            {isCompleted ? (
                                                <Check className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                            ) : (
                                                <Trophy className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground">{tier.label}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold">
                                                {tier.max === Infinity ? `${tier.min}+ referrals` : `${tier.min}–${tier.max} referrals`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-foreground italic">${tier.bonus}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Per invite</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress to next tier */}
                    {nextTier && (
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Progress to {nextTier.label}</p>
                                <p className="text-[10px] font-black text-primary">{totalReferrals}/{nextTier.min} referrals</p>
                            </div>
                            <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.min(progressToNext, 100)}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Referral History */}
            <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Referral History</h3>
                <div className="space-y-3">
                    {mockReferrals.map(ref => {
                        const config = statusConfig[ref.status];
                        return (
                            <div key={ref.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-transparent hover:border-border transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground">{ref.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold">Joined {new Date(ref.joinedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-black text-foreground">{ref.totalSales} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary">${ref.bonusEarned}</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase">Bonus</p>
                                    </div>
                                    <Badge className={`${config.bg} ${config.color} border-none text-[9px] font-black uppercase px-3 rounded-full`}>
                                        {ref.status}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReferralProgram;
