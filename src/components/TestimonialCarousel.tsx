import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { testimonials as staticTestimonials } from '@/lib/data';

const TestimonialCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % staticTestimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const current = staticTestimonials[index];

    return (
        <div className="relative w-full max-w-3xl mx-auto min-h-[400px] flex items-center justify-center py-12">
            {/* Background Aesthetic for Carousel */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full"
                >
                    <div className="p-8 md:p-12 rounded-[3rem] bg-white/5 backdrop-blur-[40px] border border-white/20 shadow-2xl flex flex-col items-center text-center group">
                        {/* Decorative Shield Icon */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-[2rem] bg-foreground flex items-center justify-center shadow-xl border-2 border-primary">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>

                        <div className="flex gap-1 mb-6 mt-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        <blockquote className="text-xl md:text-2xl font-medium text-white/90 italic tracking-tight leading-relaxed mb-10 px-4">
                            "{current.content}"
                        </blockquote>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/20 relative z-10">
                                    <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-white italic uppercase tracking-tighter">{current.name}</h4>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1 rounded-full inline-block border border-primary/20">
                                    {current.role}
                                </p>
                            </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex gap-3 mt-16">
                            {staticTestimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${index === i ? 'w-10 bg-primary' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TestimonialCarousel;
