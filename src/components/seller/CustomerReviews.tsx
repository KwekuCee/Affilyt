import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CustomerReviews = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeReply, setActiveReply] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const fetchReviews = async () => {
        if (!user) return;
        const { data } = await supabase.from("product_reviews").select("*, products!inner(title, seller_id)").eq("products.seller_id", user.id).order("created_at", { ascending: false });
        setReviews(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [user]);

    const submitReply = async (id: string) => {
        if (!replyContent.trim()) return;

        // Using a broad update because RLS on join relies on product_id check inside. For realism, it updates product_reviews.
        const { error } = await supabase.from("product_reviews").update({
            seller_response: replyContent,
            responded_at: new Date().toISOString()
        }).eq("id", id);

        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
        toast({ title: "Reply posted successfully" });
        setActiveReply(null);
        setReplyContent("");
        fetchReviews();
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        const { error } = await supabase.from("product_reviews").delete().eq("id", id);
        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
        toast({ title: "Review deleted" });
        fetchReviews();
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Customer Reviews</h2>
                    <p className="text-muted-foreground font-medium">Moderate and respond to buyer feedback.</p>
                </div>
                <Star className="h-10 w-10 text-primary" fill="currentColor" />
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="p-10 rounded-[2rem] glass text-center flex flex-col items-center border-dashed">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">No customer reviews yet.</p>
                    </div>
                ) : (
                    reviews.map(r => (
                        <div key={r.id} className="p-6 rounded-[2rem] glass space-y-4 relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-sm mb-1">{r.buyer_email} <span className="text-muted-foreground font-normal">on {r.products?.title}</span></h3>
                                    <div className="flex text-amber-500 mb-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3" fill={i < r.rating ? "currentColor" : "none"} strokeWidth={i < r.rating ? 0 : 2} />)}
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    {new Date(r.created_at).toLocaleDateString()}
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-destructive hover:bg-destructive/10" onClick={() => deleteReview(r.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm font-medium leading-relaxed bg-secondary/50 p-4 rounded-xl">{r.comment || <span className="italic opacity-50">No comment provided</span>}</p>

                            {r.seller_response ? (
                                <div className="ml-8 p-4 bg-primary/5 rounded-xl border border-primary/20 relative">
                                    <div className="absolute top-4 -left-[17px] w-4 border-t-2 border-l-2 border-primary/30 h-4 rounded-tl-xl"></div>
                                    <h4 className="text-xs font-black uppercase text-primary mb-1">Your Reply</h4>
                                    <p className="text-sm font-medium">{r.seller_response}</p>
                                </div>
                            ) : (
                                <div className="ml-8 pt-2">
                                    {activeReply === r.id ? (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Textarea
                                                placeholder="Write a public response..."
                                                className="bg-secondary/50 border-none font-medium min-h-[80px]"
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="ghost" onClick={() => setActiveReply(null)}>Cancel</Button>
                                                <Button size="sm" onClick={() => submitReply(r.id)}>Post Reply</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" className="text-xs rounded-xl" onClick={() => setActiveReply(r.id)}>
                                            <MessageSquare className="h-3 w-3 mr-2" /> Reply publicly
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerReviews;
