import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const NetworkBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-background" />
            <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-amber-500/10 rounded-full blur-[100px] mix-blend-screen" />

            <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                    backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};
