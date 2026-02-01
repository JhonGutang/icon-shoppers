"use client";

import React from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { 
  useNotifications, 
  useUnreadCount, 
  useMarkAsRead, 
  useMarkAllAsRead 
} from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Notification } from "@/services/notificationService";
import useAuthStore from "@/stores/useAuthStore";

const NotificationBell = () => {
  const router = useRouter();
  const { isSellerMode } = useAuthStore();
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData, isLoading } = useNotifications(1);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const unreadCount = unreadData?.count || 0;
  const notifications: Notification[] = notificationsData?.data || [];

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }

    const { type, order_id, order_number, conversation_id } = notification.data;

    if (type === 'order_placed') {
      router.push('/shop/orders');
    } else if (type === 'order_status_changed') {
      router.push(`/orders/${order_number || order_id}`);
    } else if (type === 'new_message') {
      router.push(`/messages?conversation_id=${conversation_id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group p-2 hover:bg-muted rounded-full transition-colors">
          <Bell size={22} />
          {unreadCount > 0 && (
            <Badge className="absolute -right-0 -top-0 h-5 w-5 justify-center rounded-full p-0 text-[10px] bg-red-500 border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 p-0" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 font-bold text-base">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-primary hover:bg-primary/5"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-1 p-4 text-left transition-colors hover:bg-muted/50 border-b last:border-0",
                    !notification.read_at && "bg-primary/[0.03]"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn(
                        "text-sm leading-tight",
                        !notification.read_at ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}>
                      {notification.data.message}
                    </span>
                    {!notification.read_at && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator className="m-0" />
        <Button 
            variant="ghost" 
            className="w-full rounded-t-none h-12 text-sm font-medium text-primary hover:bg-muted"
            onClick={() => router.push(isSellerMode ? "/shop/notifications" : "/notifications")}
        >
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
