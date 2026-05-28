import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Search, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const MessagingSystem = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch contacts (people the user has interacted with or can interact with)
  useEffect(() => {
    if (!user) return;
    const fetchContacts = async () => {
      // For this implementation, let's fetch Vendors/Affiliates from profiles
      // In a real app, you'd probably only show people you have an active relationship with
      const { data } = await supabase.from("profiles").select("*").limit(10).neq("user_id", user.id);
      setContacts(data || []);
    };
    fetchContacts();
  }, [user]);

  // Fetch messages for selected contact
  useEffect(() => {
    if (!user || !selectedContact) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages" as any)
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.user_id}),and(sender_id.eq.${selectedContact.user_id},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      setMessages(data || []);

      // Mark as read
      await supabase
        .from("messages" as any)
        .update({ is_read: true })
        .eq("sender_id", selectedContact.user_id)
        .eq("receiver_id", user.id);
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${selectedContact.user_id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.sender_id === selectedContact.user_id) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedContact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedContact || !newMessage.trim()) return;

    const msg = {
      sender_id: user.id,
      receiver_id: selectedContact.user_id,
      content: newMessage.trim(),
    };

    const { data, error } = await supabase.from("messages" as any).insert(msg).select().single();
    if (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } else {
      setMessages(prev => [...prev, data]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[600px] rounded-[2rem] glass overflow-hidden border border-white/5">
      {/* Contact List */}
      <div className="w-80 border-r border-border flex flex-col bg-secondary/20">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Messages
          </h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search people..." className="pl-9 h-10 rounded-xl bg-background/50 border-none text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedContact?.id === contact.id ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
            >
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
                {contact.full_name?.[0].toUpperCase() || "U"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm truncate">{contact.full_name || "User"}</p>
                <p className={`text-[10px] uppercase font-black tracking-widest ${selectedContact?.id === contact.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{contact.business_name || "Partner"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background/30">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {selectedContact.full_name?.[0].toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold text-sm">{selectedContact.full_name}</p>
                  <p className="text-[10px] text-success font-black uppercase tracking-widest">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium ${isMine ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg' : 'bg-muted text-foreground rounded-tl-none'}`}>
                      {msg.content}
                      <p className={`text-[9px] mt-1 opacity-50 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className="p-6 bg-background/50 backdrop-blur-md border-t border-border flex gap-3">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="h-14 rounded-2xl bg-secondary border-none font-medium px-6"
              />
              <button type="submit" className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mb-4 opacity-10" />
            <p className="font-black italic uppercase tracking-widest">Select a contact to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;
