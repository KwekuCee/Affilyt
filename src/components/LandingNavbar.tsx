import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const LandingNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Home", href: "/", isInternal: false },
        { label: "Services", href: "/#features", isInternal: true },
        { label: "Prices", href: "/#pricing", isInternal: true },
        { label: "Testimonials", href: "/#testimonials", isInternal: true },
        { label: "Blog", href: "/#blog", isInternal: true },
        { label: "About", href: "/about", isInternal: false },
        { label: "Contact", href: "/contact", isInternal: false },
    ];

    const handleNavClick = (href: string, isInternal: boolean) => {
        setIsOpen(false);
        if (isInternal && location.pathname === "/") {
            const id = href.replace("/#", "");
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/80 backdrop-blur-lg border-b border-border py-4 shadow-sm"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-black text-xl tracking-tighter text-foreground italic whitespace-nowrap">
                                AFFILIATE <span className="text-primary not-italic">HUB.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav Links */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="flex items-center gap-8 bg-card/40 backdrop-blur-md px-10 py-3 rounded-full border border-border shadow-sm">
                            {navLinks.map((link) => (
                                link.isInternal ? (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => handleNavClick(link.href, true)}
                                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 px-4 rounded-xl">
                                Login
                            </Button>
                        </Link>
                        <Link to="/become-affiliate">
                            <Button size="sm" className="rounded-full px-6 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                                Join Now <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-in slide-in-from-top duration-300 shadow-2xl">
                    <div className="flex flex-col p-6 gap-6 text-center">
                        {navLinks.map((link) => (
                            link.isInternal ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => handleNavClick(link.href, true)}
                                    className="text-sm font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                        <hr className="border-border" />
                        <div className="flex flex-col gap-4">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full rounded-2xl py-6 font-black uppercase text-xs">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/become-affiliate" onClick={() => setIsOpen(false)}>
                                <Button className="w-full rounded-2xl py-6 font-black uppercase text-xs">
                                    Join Network
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;
