import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, HelpCircle, Target, Trophy, LogOut, ArrowRight, User, Play, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LearnerSidebar = ({ user }: { user: any }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const links = [
        { path: "/dashboard/learner", icon: Target, label: "Overview" },
        { path: "/dashboard/learner/courses", icon: BookOpen, label: "Course Library" },
        { path: "/dashboard/learner/quizzes", icon: HelpCircle, label: "Quizzes & Certs" },
        { path: "/dashboard/learner/achievements", icon: Trophy, label: "Achievements" },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <aside className="w-64 glass-card border-r border-border h-full flex flex-col sticky top-0 bg-background/50 backdrop-blur-xl">
            <div className="h-20 flex items-center px-6 border-b border-border">
                <span className="font-display font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    Affilyt<span className="text-primary">.Learn</span>
                </span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 mb-4">Dashboard</p>
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link key={link.path} to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
                            <link.icon className={`h-5 w-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl glass-subtle border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user?.full_name || 'Student'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Learner</p>
                    </div>
                </div>
                <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </aside>
    );
}

const CourseCard = ({ course }: { course: any }) => (
    <div className="rounded-[2rem] glass-subtle border border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-500">
        <div className="h-48 relative overflow-hidden">
            <img src={course.image_url || "/placeholder.svg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <Button className="w-full h-12 rounded-xl scale-90 group-hover:scale-100 transition-transform duration-500 font-bold"><Play className="w-4 h-4 mr-2 fill-current" /> Start Learning</Button>
            </div>
            <div className="absolute top-4 left-4">
                <Badge className="bg-background/80 backdrop-blur-md text-foreground border-white/10 uppercase text-[10px] tracking-widest font-black">{course.category || 'Course'}</Badge>
            </div>
        </div>
        <div className="p-6">
            <h3 className="font-display font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
            <p className="text-muted-foreground text-xs line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-black">6+ Hours</span>
                </div>
            </div>
        </div>
    </div>
);

const LearnerCourses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const { data } = await supabase.from('products').select('*').eq('category', 'Courses').eq('approval_status', 'approved');
            setCourses(data || []);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Scanning Course Library...</div>

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="font-display font-bold text-3xl mb-2 tracking-tight">Course Library.</h1>
                    <p className="text-muted-foreground text-sm uppercase font-black tracking-widest">Master your craft</p>
                </div>
                <div className="flex gap-2">
                    {["All", "Trading", "Marketing", "Funnels"].map(cat => (
                        <Button key={cat} variant="outline" className="rounded-full px-6 h-10 text-xs font-black uppercase tracking-widest border-white/5 hover:bg-primary/10 hover:text-primary transition-all">{cat}</Button>
                    ))}
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="p-20 text-center glass-subtle rounded-3xl border border-dashed border-white/10">
                    <p className="text-muted-foreground">Empty library. Check back soon for premium content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
            )}
        </div>
    )
}

const LearnerOverview = ({ user }: { user: any }) => (
    <div className="max-w-5xl mx-auto animate-fade-in relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <h1 className="font-display font-bold text-3xl mb-8 relative z-10">Welcome back, <span className="text-primary">{user?.full_name?.split(' ')[0] || 'Student'}</span>.</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
            {[{ label: "Courses Completed", value: "0", icon: BookOpen }, { label: "Average Quiz Score", value: "0%", icon: HelpCircle }, { label: "Certificates Earned", value: "0", icon: Trophy }].map(stat => (
                <div key={stat.label} className="p-8 rounded-[2.5rem] glass-subtle border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase mb-2">{stat.label}</p>
                    <p className="font-display text-5xl font-black tabular-nums">{stat.value}</p>
                </div>
            ))}
        </div>

        <div className="p-10 md:p-16 rounded-[3rem] glass border border-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
            <div className="absolute right-0 bottom-0 bg-primary/20 w-64 h-64 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex-1">
                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">Kickstart</Badge>
                <h2 className="font-display text-3xl md:text-5xl font-black mb-6 leading-tight">Ready to start <br />your <span className="text-primary italic">journey?</span></h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">Dive into the course library to learn the fundamentals of generating high-ticket affiliate commissions, structuring funnels, and driving massive traffic.</p>
                <Link to="/dashboard/learner/courses"><Button size="lg" className="h-16 px-10 rounded-2xl shadow-2xl shadow-primary/30 text-base font-black">Explore Content Library <ArrowRight className="w-5 h-5 ml-2" /></Button></Link>
            </div>

            <div className="relative z-10 w-full md:w-auto">
                <div className="w-full md:w-64 aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:rotate-6 transition-transform duration-700">
                    <BookOpen className="w-24 h-24 text-primary drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </div>
    </div>
);

const LearnerDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                navigate("/login");
                return;
            }
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
            setUser(profile);
            setLoading(false);
        };
        checkAuth();
    }, [navigate]);

    if (loading) return <div className="h-screen w-full flex items-center justify-center font-display font-black text-2xl uppercase tracking-widest animate-pulse">Infiltrating Learning Hub...</div>

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            <LearnerSidebar user={user} />
            <main className="flex-1 overflow-y-auto relative z-10 w-full p-4 md:p-12">
                <Routes>
                    <Route path="/" element={<LearnerOverview user={user} />} />
                    <Route path="/courses" element={<LearnerCourses />} />
                    <Route path="/quizzes" element={<div className="p-8 animate-fade-in"><h1 className="text-2xl font-bold">Quizzes</h1><p className="text-muted-foreground mt-4 uppercase text-xs font-black tracking-widest">Evaluations coming in the next payload.</p></div>} />
                    <Route path="/achievements" element={<div className="p-8 animate-fade-in"><h1 className="text-2xl font-bold">Achievements</h1><p className="text-muted-foreground mt-4 uppercase text-xs font-black tracking-widest">Unlock badges for excellence.</p></div>} />
                </Routes>
            </main>
        </div>
    );
};
export default LearnerDashboard;
