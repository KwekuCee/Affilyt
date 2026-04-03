import React from 'react';

const GlobalBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            <div className="absolute top-[30%] right-[15%] w-[25%] h-[25%] bg-success/10 blur-[100px] rounded-full animate-pulse [animation-delay:4s]" />
            <div className="absolute bottom-[20%] left-[10%] w-[20%] h-[20%] bg-primary/10 blur-[80px] rounded-full animate-pulse [animation-delay:1s]" />

            {/* Modern Depth Layers */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-75 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Dynamic Grid System */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

            {/* Secondary Fine Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:128px_128px]" />

            {/* Vignette for Cinematic Feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
        </div>
    );
};

export default GlobalBackground;
