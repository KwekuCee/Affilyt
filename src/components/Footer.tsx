import { Link } from "react-router-dom";
import { Linkedin, Twitter, Github, Mail, Shield, MessageSquare } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-border bg-card/50 backdrop-blur-xl mt-auto">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-foreground group">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span>Affilyt</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Everything you need to grow your affiliate business and earn more. Simple, fast, and trusted.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <a key={i} href={social.href} className="p-2.5 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all">
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Platform</h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="/become-affiliate" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Become an Affiliate</Link>
                            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Marketplace</Link>
                            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Contact Support</Link>
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Compliance</h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Terms of Service</Link>
                            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Privacy Policy</Link>
                            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">Refund Policy</Link>
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Direct Help</h5>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:support@affilyt.site" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                </div>
                                support@affilyt.site
                            </a>
                            <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <MessageSquare className="h-4 w-4 text-green-500" />
                                </div>
                                WhatsApp Support
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                        © 2026 AFFILYT. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-secondary/50 border border-border backdrop-blur-sm group">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] font-black text-foreground tracking-[0.2em] uppercase">
                            Developed by <a href="https://primehaven.tech"><span className="text-primary italic">PRIME HAVEN</span></a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
