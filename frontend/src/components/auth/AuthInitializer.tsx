"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useAuth from "@/hooks/auth/useAuth";
import { RoleSelectionDialog } from "./RoleSelectionDialog";

export const AuthInitializer = () => {
  const { needsRoleSelection, setNeedsRoleSelection, hasHydrated } = useAuthStore();
  const { handleRoleSelect } = useAuth();
  const isOpen = hasHydrated && needsRoleSelection;

  const onSelect = (role: "customer" | "seller") => {
    handleRoleSelect(role);
  };

  if (!hasHydrated) return null;

  return (
    <RoleSelectionDialog 
      isOpen={isOpen} 
      onSelect={onSelect} 
    />
  );
};
