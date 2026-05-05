import { motion } from "framer-motion";
import { Globe, Award, Zap, CheckCircle2, TrendingUp, Heart, Target } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const About = () => (
  <div className="min-h-screen overflow-x-hidden">
    <LandingNavbar />

    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">Our story</Badge>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">
          Building the affiliate <span className="text-gradient">economy of tomorrow.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Affilyt is an affiliate marketplace built for the next generation of digital entrepreneurs across Africa, the UK and the US.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-square rounded-2xl gradient-hero p-1 shadow-elevated">
            <div className="h-full w-full rounded-2xl glass flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh" />
              <TrendingUp className="h-32 w-32 text-primary relative" />
            </div>
          </motion.div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Mission</p>
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">Empowering creators to earn freely.</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We provide vetted digital products, real-time tracking, transparent commissions, and same-week payouts — so anyone with an audience can build a real business.
            </p>
            <div className="space-y-5">
              {[
                { icon: Zap, title: "Fast", desc: "Sign up, generate links, and earn within minutes." },
                { icon: Award, title: "Quality", desc: "Every product is reviewed by admin before listing." },
                { icon: Globe, title: "Global", desc: "Operating across Ghana, Nigeria, USA, and London." },
              ].map((it) => (
                <div key={it.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{it.title}</h4>
                    <p className="text-sm text-muted-foreground">{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="container mx-auto px-4 relative max-w-6xl">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow mb-3">Values</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">What drives us.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: CheckCircle2, title: "Transparency", desc: "Real-time access to every metric. You always know where you stand." },
            { icon: Target, title: "Growth-first", desc: "We win when our partners win. Your scale is our priority." },
            { icon: Heart, title: "Support", desc: "Real humans, fast responses, dedicated success teams." },
          ].map((v) => (
            <div key={v.title} className="p-7 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
              <div className="h-11 w-11 rounded-md bg-white/10 flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-primary-glow" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
