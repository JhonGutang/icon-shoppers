import { useState, useEffect, useCallback } from "react";
import { ShopAnalytics } from "@/types/shopAnalytics";
import { fetchShopAnalytics } from "@/services/shopAnalyticsService";

export const useShopAnalytics = () => {
  const [analytics, setAnalytics] = useState<ShopAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchShopAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching shop analytics:", err);
      setError("Failed to load shop analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: loadAnalytics,
  };
};
