"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import useAuthStore from "@/stores/useAuthStore";

export default function CartInitializer() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      fetchCart();
    }
  }, [accessToken, fetchCart]);

  return null;
}
