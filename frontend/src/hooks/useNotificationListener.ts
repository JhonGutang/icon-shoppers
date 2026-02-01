"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/stores/useAuthStore";
import echo from "@/libs/echo";

export const useNotificationListener = () => {
  const queryClient = useQueryClient();
  const { id, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated() || !id || !echo) {
      return;
    }

    const channelName = `App.Models.User.${id}`;
    const channel = echo.private(channelName);

    channel.notification((notification: any) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    });

    return () => {
      console.log(`🔌 Unsubscribing from notification channel: ${channelName}`);
      echo.leave(channelName);
    };
  }, [id, isAuthenticated, queryClient]);
};
