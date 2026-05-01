import React, { useState } from "react";
import { MessageSquare, Sparkles, Send, X, Bot, Shield, Zap, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HelpAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Agent Spark here. How can I help you dominate the leaderboard today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", content: input }]);
        setInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "bot", content: "I'm currently in high-speed training. For now, check the Resources tab or contact support for direct assistance!" }]);
        }, 1000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 h-16 w-16 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center group z-[100] hover:scale-110 transition-transform active:scale-95"
            >
                <Sparkles className="h-8 w-8 group-hover:rotate-12 transition-transform" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-28 right-8 w-[400px] h-[550px] bg-card/80 backdrop-blur-3xl border-2 border-primary/20 rounded-[3rem] shadow-2xl z-[100] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-sm uppercase tracking-widest italic">Help AI</p>
                                    <p className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">Powered by Affilyt Gen-3</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="h-10 w-10 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-border bg-secondary/30">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="h-14 rounded-2xl bg-card border-none pl-6 pr-12 font-bold focus-visible:ring-primary/50"
                                />
                                <Button
                                    onClick={handleSend}
                                    size="icon"
                                    className="absolute right-2 h-10 w-10 rounded-xl"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <button className="text-[10px] font-black uppercase text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> Security
                                </button>
                                <button className="text-[10px] font-black uppercase text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> Quick Tips
                                </button>
                                <button className="text-[10px] font-black uppercase text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
                                    <HelpCircle className="h-3 w-3" /> Support
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HelpAI;
