"use client";

import React from 'react';
import useAuthStore from "@/stores/useAuthStore";
import PageLoader from "@/components/shared/loaders/PageLoader";

export default function GlobalLoader() {
  const isLoading = useAuthStore((state) => state.isLoading);
  return <PageLoader isLoading={isLoading} />;
}
