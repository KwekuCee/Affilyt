const GlobalBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
    <div className="absolute inset-0 gradient-mesh opacity-70" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_50%,transparent_100%)]" />
  </div>
);
export default GlobalBackground;
