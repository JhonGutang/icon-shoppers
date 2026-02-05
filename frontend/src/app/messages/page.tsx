"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar";
import { Search, Send, MoreVertical, Phone, Video, MessageSquare, ChevronLeft, Loader2 } from "lucide-react";
import echo from "@/lib/echo";
import useAuthStore from "@/stores/useAuthStore";
import * as chatService from "@/services/chatService";
import { useRouter } from "next/navigation";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import MessagesSkeleton from "@/components/shared/skeletons/MessagesSkeleton";

const MessagingPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId, accessToken: token, isSellerMode } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // Fetch Conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: chatService.getConversations,
    enabled: !!token,
  });

  // Fetch Messages (Infinite Query)
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: ({ pageParam = 1 }) => chatService.getPaginatedMessages(selectedConversation.id, pageParam as number),
    enabled: !!selectedConversation?.id,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const messages = messagesData?.pages.flatMap((page) => page.data).reverse() || [];

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: number; body: string }) =>
      chatService.sendMessage(conversationId, body),
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ["messages", newMsg.conversationId] });
      const previousMessages = queryClient.getQueryData(["messages", newMsg.conversationId]);

      // Optimistic update
      const tempId = Date.now();
      const tempMsg = {
        id: tempId,
        body: newMsg.body,
        sender_id: userId,
        created_at: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData(["messages", newMsg.conversationId], (old: any) => {
        if (!old) return old;
        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          data: [tempMsg, ...newPages[0].data],
        };
        return { ...old, pages: newPages };
      });

      return { previousMessages, tempId };
    },
    onError: (err, newMsg, context: any) => {
      queryClient.setQueryData(["messages", newMsg.conversationId], context.previousMessages);
    },
    onSuccess: (sentMsg, variables, context) => {
      // Replace temp message with real one, but ONLY if the real one isn't already there from Echo
      queryClient.setQueryData(["messages", variables.conversationId], (old: any) => {
        if (!old) return old;
        
        const allMsgs = old.pages.flatMap((p: any) => p.data);
        const alreadyExists = allMsgs.some((m: any) => m.id === sentMsg.id && !m.isOptimistic);

        if (alreadyExists) {
            // Echo already added it, just remove the temp one
            return {
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    data: page.data.filter((m: any) => m.id !== context.tempId)
                }))
            };
        }

        const newPages = old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((m: any) => (m.id === context.tempId ? sentMsg : m)),
        }));
        return { ...old, pages: newPages };
      });
      
      // Update last message in conversations list
      queryClient.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;
        return old.map((conv: any) => 
          conv.id === variables.conversationId 
            ? { ...conv, last_message: sentMsg, last_message_at: sentMsg.created_at } 
            : conv
        );
      });
    },
  });

  // Infinite Scroll Observer
  useEffect(() => {
    if (!topObserverRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          previousScrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(topObserverRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    if (scrollRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
      previousScrollHeightRef.current = 0;
    }
  }, [messagesData]);

  // Initial scroll to bottom when messages finish loading
  useEffect(() => {
    if (selectedConversation && !isLoadingMessages && messages.length > 0) {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }
  }, [selectedConversation, isLoadingMessages]);

  // Scroll to bottom on new message if at bottom
  useEffect(() => {
    if (scrollRef.current) {
      const isAtBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop <= scrollRef.current.clientHeight + 150;
      if (isAtBottom) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages.length]);

  // Real-time listener
  useEffect(() => {
    if (selectedConversation) {
      console.log("%c!!!! ECHO JOIN STARTING !!!!", "color: blue; font-weight: bold; font-size: 15px;", `chat.${selectedConversation.id}`);
      
      const channel = echo.join(`chat.${selectedConversation.id}`)
        .here((users: any) => {
          console.log("%c📍 Presence: Current users in channel:", "color: green; font-weight: bold;", users);
          setOnlineUsers(users);
        })
        .joining((user: any) => {
          console.log("%c📍 Presence: User joining:", "color: green; font-weight: bold;", user);
          setOnlineUsers((prev) => [...prev, user]);
        })
        .leaving((user: any) => {
          console.log("%c📍 Presence: User leaving:", "color: orange; font-weight: bold;", user);
          setOnlineUsers((prev) => prev.filter(u => u.id !== user.id));
        })
        .listen(".MessageSent", (e: any) => {
          console.log("%c📩 Message received:", "color: cyan; font-weight: bold;", e);
          
          // Update message cache
          queryClient.setQueryData(["messages", selectedConversation.id], (old: any) => {
            if (!old) return old;
            
            // Check for duplicates (even ones currently marked as optimistic)
            const allMsgs = old.pages.flatMap((p: any) => p.data);
            if (allMsgs.some((m: any) => m.id === e.message.id)) return old;

            const newPages = [...old.pages];
            newPages[0] = {
              ...newPages[0],
              data: [e.message, ...newPages[0].data],
            };
            return { ...old, pages: newPages };
          });

          // Update conversations list cache
          queryClient.setQueryData(["conversations"], (old: any) => {
            if (!old) return old;
            return old.map((conv: any) => 
              conv.id === selectedConversation.id 
                ? { ...conv, last_message: e.message, last_message_at: e.message.created_at } 
                : conv
            );
          });
        });

      // Bind to internal Pusher events to debug
      (channel as any).subscription.bind("pusher:subscription_succeeded", () => {
        console.log("%c✅ Subscription Succeeded", "color: green; font-weight: bold; font-size: 12px;");
      });

      (channel as any).subscription.bind("pusher:subscription_error", (error: any) => {
        console.error("%c❌ Subscription Error:", "color: red; font-weight: bold; font-size: 12px;", error);
      });

      return () => {
        console.log("%c!!!! ECHO LEAVING CHANNEL !!!!", "color: orange; font-weight: bold;", `chat.${selectedConversation.id}`);
        echo.leave(`chat.${selectedConversation.id}`);
        setOnlineUsers([]);
      };
    }
  }, [selectedConversation, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      conversationId: selectedConversation.id,
      body: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b h-16 flex items-center px-4 shrink-0 shadow-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft size={20} className="text-muted-foreground" />
                </Button>
                <h1 className="text-lg font-bold text-gray-800">Messages</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-500">
                    <Search size={20} />
                </Button>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
            </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 overflow-hidden p-4">
        <SkeletonLayer isLoading={isLoadingConversations} fallback={<MessagesSkeleton />}>
            <div className="flex w-full h-full gap-4">
                {/* Sidebar - Conversation List */}
                <Card className="flex w-full max-w-sm flex-col overflow-hidden shadow-md border-none bg-white">
                <div className="p-4 border-b space-y-3 bg-white">
                    <h2 className="font-semibold text-gray-700">Inbox</h2>
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        className="w-full bg-gray-100 border-none rounded-full pl-9 pr-4 h-10 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length > 0 ? (
                    conversations.map((conv: any) => (
                        <div 
                        key={conv.id} 
                        onClick={() => setSelectedConversation(conv)}
                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b last:border-0 hover:bg-gray-50 ${
                            selectedConversation?.id === conv.id ? "bg-green-50 border-l-4 border-l-green-600" : ""
                        }`}
                        >
                        <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={conv.shop?.logo_image} />
                            <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                                {conv.shop?.name[0] || "S"}
                            </AvatarFallback>
                            </Avatar>
                            {/* Online Badges would go here */}
                        </div>
                        
                        <div className="flex-1 min-w-0">
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
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] flex flex-col">
                        {/* Top Observer for Infinite Scroll */}
                        <div ref={topObserverRef} className="h-4 flex items-center justify-center">
                            {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin text-green-600" />}
                        </div>

                        <div className="flex-1 flex flex-col justify-end gap-4 min-h-min">
                        {messages.map((msg: any) => (
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
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t bg-white">
                        <form 
                        onSubmit={handleSendMessage}
                        className="flex gap-2"
                        >
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-gray-100 border-none rounded-full px-6 h-11 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                        />
                        <Button 
                            type="submit" 
                            disabled={sendMessageMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 rounded-full h-11 w-11 p-0 flex items-center justify-center"
                        >
                            {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
            </div>
        </SkeletonLayer>
      </main>
    </div>
  );
};

export default MessagingPage;
