import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Play, FileText, Download, Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CoursePlayer = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Course/Product
        const { data: product } = await supabase.from("products").select("*").eq("id", productId).single();
        setCourse(product);

        // 2. Fetch Modules and Lessons
        const { data: modulesData } = await supabase
          .from("course_modules" as any)
          .select("*, course_lessons(*)")
          .eq("product_id", productId)
          .order("order_index", { ascending: true });

        // Sort lessons within modules
        const sortedModules = (modulesData || []).map((m: any) => ({
          ...m,
          course_lessons: (m.course_lessons || []).sort((a: any, b: any) => a.order_index - b.order_index)
        }));

        setModules(sortedModules);

        // 3. Set Initial Lesson if not set
        if (sortedModules.length > 0 && sortedModules[0].course_lessons.length > 0) {
          setCurrentLesson(sortedModules[0].course_lessons[0]);
        }

        // 4. Fetch Progress
        const { data: progressData } = await supabase
          .from("learner_progress" as any)
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("product_id", productId);

        setProgress((progressData || []).map((p: any) => p.lesson_id));

      } catch (err) {
        console.error("Error fetching course data:", err);
        toast({ title: "Error", description: "Failed to load course content.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, user]);

  const toggleComplete = async (lessonId: string) => {
    if (!user || !productId) return;

    const isCompleted = progress.includes(lessonId);

    if (isCompleted) {
      await supabase.from("learner_progress" as any).delete().eq("user_id", user.id).eq("lesson_id", lessonId);
      setProgress(progress.filter(id => id !== lessonId));
    } else {
      await supabase.from("learner_progress" as any).insert({ user_id: user.id, product_id: productId, lesson_id: lessonId });
      setProgress([...progress, lessonId]);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Course Player...</div>;
  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar - Lessons List */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 glass-sidebar border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <span className="font-bold truncate text-sm">{course.title}</span>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {modules.map((module, mIdx) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2">Module {mIdx + 1}: {module.title}</h3>
              <div className="space-y-1">
                {module.course_lessons.map((lesson: any) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isDone = progress.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                    >
                      {isDone ? <CheckCircle className="h-4 w-4 shrink-0 text-success" /> : <Play className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 text-left truncate font-medium">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className={`${sidebarOpen ? 'hidden' : 'flex'} lg:hidden`}><Menu className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/learner/courses")} className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Library</Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">{progress.length} / {modules.reduce((acc, m) => acc + m.course_lessons.length, 0)} Completed</span>
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(progress.length / modules.reduce((acc, m) => acc + (m.course_lessons?.length || 0), 0)) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-8">
            {currentLesson ? (
              <>
                <div className="aspect-video w-full rounded-3xl bg-black overflow-hidden shadow-2xl relative">
                  {currentLesson.video_url ? (
                    <iframe
                      src={currentLesson.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Play className="h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium">No video for this lesson.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-black italic tracking-tight">{currentLesson.title}</h1>
                    <p className="text-muted-foreground mt-2 font-medium">{currentLesson.description}</p>
                  </div>
                  <Button
                    onClick={() => toggleComplete(currentLesson.id)}
                    className={`h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all ${progress.includes(currentLesson.id) ? 'bg-success hover:bg-success/90' : 'bg-primary shadow-primary/20'}`}
                  >
                    {progress.includes(currentLesson.id) ? <CheckCircle className="h-4 w-4 mr-2" /> : <Circle className="h-4 w-4 mr-2" />}
                    {progress.includes(currentLesson.id) ? "Completed" : "Mark as Complete"}
                  </Button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content || "" }} />
                </div>

                {/* Mock Resource Download Section */}
                <div className="p-8 rounded-[2rem] glass-subtle border border-white/5 space-y-4">
                  <h3 className="font-black uppercase text-xs tracking-widest text-primary flex items-center gap-2">
                    <Download className="h-4 w-4" /> Lesson Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between group hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-bold">CheatSheet.pdf</span>
                      </div>
                      <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
                <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                <h2 className="text-2xl font-black italic">Select a lesson to begin.</h2>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayer;
