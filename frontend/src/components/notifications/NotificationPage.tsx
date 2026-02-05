"use client";

import React from "react";
import { Bell, Check, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { 
  useNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead 
} from "@/hooks/notification/useNotifications";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { ScrollArea } from "@/components/shared/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Notification } from "@/services/notificationService";

interface NotificationPageProps {
  title: string;
  onBack?: () => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({ title, onBack }) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { data: notificationsData, isLoading } = useNotifications(page);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications: Notification[] = notificationsData?.data || [];
  const meta = notificationsData?.meta;

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
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {notifications.some(n => !n.read_at) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className={cn(
                  "flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-muted/50",
                  !notification.read_at && "bg-primary/[0.02]"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm",
                  !notification.read_at ? "bg-primary/10 border-primary/20" : "bg-muted border-muted-foreground/10"
                )}>
                  <Bell className={cn("h-5 w-5", !notification.read_at ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium leading-relaxed",
                      !notification.read_at ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {notification.data.message}
                    </p>
                    {!notification.read_at && (
                      <Badge className="bg-primary text-primary-foreground">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/30">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No notifications yet</h3>
            <p className="max-w-[250px] text-sm text-muted-foreground mt-1">
              We&apos;ll notify you when something important happens!
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.last_page}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === meta.last_page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
