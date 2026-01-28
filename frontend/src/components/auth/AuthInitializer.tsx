"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useAuth from "@/hooks/useAuth";
import { RoleSelectionDialog } from "./RoleSelectionDialog";

export const AuthInitializer = () => {
  const { needsRoleSelection, setNeedsRoleSelection, hasHydrated } = useAuthStore();
  const { handleRoleSelect } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && needsRoleSelection) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [hasHydrated, needsRoleSelection]);

  const onSelect = (role: "customer" | "seller") => {
    handleRoleSelect(role);
    setIsOpen(false);
  };

  if (!hasHydrated) return null;

  return (
    <RoleSelectionDialog 
      isOpen={isOpen} 
      onSelect={onSelect} 
    />
  );
};
