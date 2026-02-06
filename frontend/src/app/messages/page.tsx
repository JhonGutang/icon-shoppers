"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui/avatar";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  MessageSquare,
  ChevronLeft,
  Loader2,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import echo from "@/lib/echo";
import useAuthStore from "@/stores/useAuthStore";
import * as chatService from "@/services/chatService";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import MessagesSkeleton from "@/components/shared/skeletons/MessagesSkeleton";

const MessagingPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId, accessToken: token } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // Fetch Conversations
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useQuery({
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
    queryFn: ({ pageParam = 1 }) =>
      chatService.getPaginatedMessages(
        selectedConversation.id,
        pageParam as number,
      ),
    enabled: !!selectedConversation?.id,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const messages =
    messagesData?.pages.flatMap((page) => page.data).reverse() || [];

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({
      conversationId,
      body,
    }: {
      conversationId: number;
      body: string;
    }) => chatService.sendMessage(conversationId, body),
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", newMsg.conversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        newMsg.conversationId,
      ]);

      // Optimistic update
      const tempId = Date.now();
      const tempMsg = {
        id: tempId,
        body: newMsg.body,
        sender_id: userId,
        created_at: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData(
        ["messages", newMsg.conversationId],
        (old: any) => {
          if (!old) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            data: [tempMsg, ...newPages[0].data],
          };
          return { ...old, pages: newPages };
        },
      );

      return { previousMessages, tempId };
    },
    onError: (err, newMsg, context: any) => {
      queryClient.setQueryData(
        ["messages", newMsg.conversationId],
        context.previousMessages,
      );
    },
    onSuccess: (sentMsg, variables, context) => {
      // Replace temp message with real one, but ONLY if the real one isn't already there from Echo
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: any) => {
          if (!old) return old;

          const allMsgs = old.pages.flatMap((p: any) => p.data);
          const alreadyExists = allMsgs.some(
            (m: any) => m.id === sentMsg.id && !m.isOptimistic,
          );

          if (alreadyExists) {
            // Echo already added it, just remove the temp one
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                data: page.data.filter((m: any) => m.id !== context.tempId),
              })),
            };
          }

          const newPages = old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((m: any) =>
              m.id === context.tempId ? sentMsg : m,
            ),
          }));
          return { ...old, pages: newPages };
        },
      );

      // Update last message in conversations list
      queryClient.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;
        return old.map((conv: any) =>
          conv.id === variables.conversationId
            ? {
                ...conv,
                last_message: sentMsg,
                last_message_at: sentMsg.created_at,
              }
            : conv,
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
          previousScrollHeightRef.current =
            scrollRef.current?.scrollHeight || 0;
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(topObserverRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    if (scrollRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTop =
        newScrollHeight - previousScrollHeightRef.current;
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
      const isAtBottom =
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop <=
        scrollRef.current.clientHeight + 150;
      if (isAtBottom) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages.length]);

  // Real-time listener
  useEffect(() => {
    if (selectedConversation) {
      const channel = echo
        .join(`chat.${selectedConversation.id}`)
        .here((users: any) => {
          setOnlineUsers(users);
        })
        .joining((user: any) => {
          setOnlineUsers((prev) => [...prev, user]);
        })
        .leaving((user: any) => {
          setOnlineUsers((prev) => prev.filter((u) => u.id !== user.id));
        })
        .listen(".MessageSent", (e: any) => {
          // Update message cache
          queryClient.setQueryData(
            ["messages", selectedConversation.id],
            (old: any) => {
              if (!old) return old;

              // Check for duplicates
              const allMsgs = old.pages.flatMap((p: any) => p.data);
              if (allMsgs.some((m: any) => m.id === e.message.id)) return old;

              const newPages = [...old.pages];
              newPages[0] = {
                ...newPages[0],
                data: [e.message, ...newPages[0].data],
              };
              return { ...old, pages: newPages };
            },
          );

          // Update conversations list cache
          queryClient.setQueryData(["conversations"], (old: any) => {
            if (!old) return old;
            return old.map((conv: any) =>
              conv.id === selectedConversation.id
                ? {
                    ...conv,
                    last_message: e.message,
                    last_message_at: e.message.created_at,
                  }
                : conv,
            );
          });
        });

      return () => {
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
    <div className="flex h-screen flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 h-16 flex items-center px-4 shrink-0 z-10 sticky top-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-stone-100 text-stone-600"
            >
              <ChevronLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Messages
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 overflow-hidden p-4 sm:p-6 gap-6">
        <SkeletonLayer
          isLoading={isLoadingConversations}
          fallback={<MessagesSkeleton />}
        >
          <div className="flex w-full h-full gap-6">
            {/* Sidebar - Conversation List */}
            <Card className="flex w-full max-w-sm flex-col overflow-hidden shadow-sm border border-stone-200 bg-white rounded-2xl">
              <div className="p-4 border-b border-stone-100 space-y-3 bg-white/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-stone-800 tracking-tight">
                    Inbox
                  </h2>
                </div>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4 group-focus-within:text-[#0E6835] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-stone-50 border border-transparent focus:border-stone-200 rounded-xl pl-9 pr-4 h-10 text-sm outline-none focus:ring-2 focus:ring-[#0E6835]/10 text-stone-700 transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.length > 0 ? (
                  conversations.map((conv: any) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-stone-50 last:border-0 hover:bg-stone-50 relative overflow-hidden ${
                        selectedConversation?.id === conv.id
                          ? "bg-stone-50"
                          : ""
                      }`}
                    >
                      {selectedConversation?.id === conv.id && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-[#0E6835]"
                        />
                      )}
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-stone-100">
                          <AvatarImage src={conv.shop?.logo_image} />
                          <AvatarFallback className="bg-stone-200 text-stone-600 font-bold">
                            {conv.shop?.name[0] || "S"}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online Badges would go here */}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span
                            className={`font-semibold truncate text-sm ${selectedConversation?.id === conv.id ? "text-[#0E6835]" : "text-stone-900"}`}
                          >
                            {userId === conv.buyer_id
                              ? conv.shop?.name
                              : conv.buyer?.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {conv.last_message_at
                              ? new Date(
                                  conv.last_message_at,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate ${selectedConversation?.id === conv.id ? "text-stone-600 font-medium" : "text-stone-500"}`}
                        >
                          {conv.last_message?.body || "No messages yet"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center text-stone-400 text-sm flex flex-col items-center gap-2">
                    <MessageSquare className="h-8 w-8 text-stone-300" />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Chat Window */}
            <Card className="flex flex-1 flex-col overflow-hidden shadow-sm border border-stone-200 bg-white rounded-2xl relative">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-stone-100">
                        <AvatarImage
                          src={selectedConversation.shop?.logo_image}
                        />
                        <AvatarFallback className="bg-[#0E6835] text-white font-bold">
                          {selectedConversation.shop?.name[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">
                          {userId === selectedConversation.buyer_id
                            ? selectedConversation.shop?.name
                            : selectedConversation.buyer?.name}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ring-2 ring-white ${
                              onlineUsers.length > 1
                                ? "bg-[#0E6835]"
                                : "bg-stone-300"
                            }`}
                          ></div>
                          <span className="text-[11px] font-medium text-stone-500">
                            {onlineUsers.length > 1 ? "Online" : "Away"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/30 flex flex-col"
                  >
                    {/* Top Observer for Infinite Scroll */}
                    <div
                      ref={topObserverRef}
                      className="h-4 flex items-center justify-center shrink-0"
                    >
                      {isFetchingNextPage && (
                        <Loader2 className="h-4 w-4 animate-spin text-[#0E6835]" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-end gap-2 min-h-min">
                      <AnimatePresence initial={false}>
                        {messages.map((msg: any, index: number) => {
                          const isMe = msg.sender_id === userId;
                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.2 }}
                              key={msg.id}
                              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                              >
                                <div
                                  className={`
                                            px-4 py-3 text-sm shadow-sm relative group
                                            ${
                                              isMe
                                                ? "bg-[#0E6835] text-white rounded-2xl rounded-tr-sm"
                                                : "bg-white text-stone-800 border border-stone-200 rounded-2xl rounded-tl-sm"
                                            }
                                        `}
                                >
                                  <p className="leading-relaxed">{msg.body}</p>
                                </div>
                                <div
                                  className={`flex items-center gap-1 mt-1 text-[10px] font-medium px-1 ${isMe ? "text-stone-400" : "text-stone-400"}`}
                                >
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                  {isMe && (
                                    <CheckCheck className="h-3 w-3 text-[#0E6835]" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 bg-white border-t border-stone-100">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex gap-3 items-end"
                    >
                      <div className="flex-1 relative">
                        <input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Write a message..."
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#0E6835]/20 focus:border-[#0E6835] text-sm text-stone-800 placeholder:text-stone-400 transition-all shadow-sm"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          !newMessage.trim() || sendMessageMutation.isPending
                        }
                        className={`
                                rounded-full h-11 w-11 p-0 flex items-center justify-center transition-all shadow-md
                                ${
                                  !newMessage.trim()
                                    ? "bg-stone-100 text-stone-400"
                                    : "bg-[#0E6835] hover:bg-[#0b5029] text-white hover:scale-105"
                                }
                            `}
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-stone-500 p-8 text-center bg-stone-50/30">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-full shadow-sm border border-stone-100 mb-6 relative"
                  >
                    <div className="absolute -top-1 -right-1 bg-stone-100 p-1.5 rounded-full">
                      <Sparkles className="h-4 w-4 text-[#0E6835]" />
                    </div>
                    <MessageSquare className="h-10 w-10 text-[#0E6835]" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">
                    Your Conversations
                  </h3>
                  <p className="max-w-xs text-stone-500 leading-relaxed">
                    Select a conversation to start chatting with artisans and
                    sellers.
                  </p>
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
