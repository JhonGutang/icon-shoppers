"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, MoreVertical, Phone, Video, MessageSquare, ChevronLeft } from "lucide-react";
import echo from "@/libs/echo";
import useAuthStore from "@/stores/useAuthStore";
import * as chatService from "@/services/chatService";
import { useRouter } from "next/navigation";

const MessagingPage = () => {
  const router = useRouter();
  const { id: userId, accessToken: token, isSellerMode } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      
      const channel = echo.join(`chat.${selectedConversation.id}`)
        .here((users: any[]) => {
          console.log("👥 Users currently in chat:", users);
          setOnlineUsers(users);
        })
        .joining((user: any) => {
          console.log("👋 User joined:", user);
          setOnlineUsers((prev) => [...prev, user]);
        })
        .leaving((user: any) => {
          console.log("🏃 User left:", user);
          setOnlineUsers((prev) => prev.filter(u => u.id !== user.id));
        })
        .listen(".MessageSent", (e: any) => {
          console.log("📩 Message received:", e);
          setMessages((prev) => {
            // Avoid duplicate messages if the sender just added it locally
            if (prev.some(m => m.id === e.message.id)) return prev;
            return [...prev, e.message];
          });
        });

      return () => {
        echo.leave(`chat.${selectedConversation.id}`);
        setOnlineUsers([]);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (id: number) => {
    try {
      const data = await chatService.getConversationMessages(id);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const body = newMessage;
    setNewMessage("");

    // Optimistic update
    const tempId = Date.now();
    const tempMsg = {
      id: tempId,
      body: body,
      sender_id: userId,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      console.log("📤 Sending message to backend...", { conversation_id: selectedConversation.id, body });
      const sentMsg = await chatService.sendMessage(selectedConversation.id, body);
      console.log("✅ Message sent successfully, response:", sentMsg);
      // Replace temp message with real one from server to get correct ID/timestamps
      setMessages((prev) => prev.map(m => m.id === tempId ? sentMsg : m));
    } catch (err) {
      console.error("❌ Failed to send message", err);
      // Optional: remove temp message on failure
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      {/* Header with Back Button */}
      <header className="bg-white border-b h-16 flex items-center px-4 shrink-0 shadow-sm z-10">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push(isSellerMode ? "/shop" : "/home")}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full pr-6"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">
              {isSellerMode ? "Back to Dashboard" : "Back to Home"}
            </span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 overflow-hidden p-4 gap-4">
        {/* Sidebar - Conversation List */}
        <Card className="flex w-full max-w-sm flex-col overflow-hidden shadow-md border-none">
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                placeholder="Search messages..." 
                className="w-full pl-10 h-10 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-green-500 outline-none text-sm px-4" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b last:border-none ${
                    selectedConversation?.id === conv.id ? "bg-green-50" : ""
                  }`}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                    <AvatarImage src={conv.shop?.logo_image} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                      {conv.shop?.name[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold truncate text-sm">
                        {userId === conv.buyer_id ? conv.shop?.name : conv.buyer?.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.last_message?.body || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No conversations found</div>
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="flex flex-1 flex-col overflow-hidden shadow-md border-none">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.shop?.logo_image} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                      {selectedConversation.shop?.name[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">
                        {userId === selectedConversation.buyer_id ? selectedConversation.shop?.name : selectedConversation.buyer?.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${
                        onlineUsers.length > 1 ? "bg-green-500" : "bg-gray-300"
                      }`}></div>
                      <span className="text-[10px] text-muted-foreground">
                        {onlineUsers.length > 1 ? "Online" : "Away"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-500"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-gray-500"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-gray-500"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                      msg.sender_id === userId 
                        ? "bg-green-600 text-white rounded-tr-none" 
                        : "bg-white text-gray-800 rounded-tl-none"
                    }`}>
                      {msg.body}
                      <div className={`text-[10px] mt-1 ${msg.sender_id === userId ? "text-green-100" : "text-gray-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t bg-white">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 border-none rounded-full px-6 h-11 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                  />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-full h-11 w-11 p-0 flex items-center justify-center">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground p-8 text-center bg-white">
              <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Your Conversations</h3>
              <p className="max-w-xs text-sm">Stay connected with your favorite local shops. Chat about products, orders, and more.</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default MessagingPage;
