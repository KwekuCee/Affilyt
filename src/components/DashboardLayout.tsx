import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { Bell, Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import NotificationsBell from "./NotificationsBell";
import AnnouncementBanner from "./AnnouncementBanner";

interface DashboardLayoutProps {
  type: "admin" | "vendor" | "affiliate" | "learner";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ type }) => {
  const { profile, user } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from("messages" as any)
        .select("*", { count: 'exact', head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);
      setUnreadCount(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel('unread_messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`min-h-screen flex bg-background theme-${type} relative overflow-hidden text-foreground`}>
      {/* Glassmorphic Animated Background Blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <DashboardSidebar type={type as any} />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header - Unified for Dashboards */}
        <header className="h-14 sticky top-0 z-40 glass-sidebar backdrop-blur border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button which is fixed in DashboardSidebar */}

          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 h-9 bg-muted/40 border-none rounded-xl" />
          </div>

          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-1">
            <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors relative">
              <MessageSquare className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-background" />
              )}
            </button>
            <NotificationsBell />
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
              {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="text-xs hidden md:block">
              <div className="font-semibold truncate max-w-[120px]">{profile?.full_name || "User"}</div>
              <div className="text-muted-foreground truncate max-w-[120px]">{user?.email}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto relative z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <AnnouncementBanner audience={type} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
