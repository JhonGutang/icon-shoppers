"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
    theme={theme as ToasterProps["theme"]}
    position="top-right"
    toastOptions={{
      classNames: {
        toast:
          "group toast  px-4 py-2 rounded-md font-medium animate-slide-in border-none",
      },
    }}
    {...props}
  />
  
  );
};

// ✅ Function to trigger toasts with dynamic styles
const showToast = (
  type: "success" | "error" | "warning" | "info",
  message: string
) => {
  toast(message, {
    className: "px-4 py-2 rounded-md font-medium text-white",
    style: {
      backgroundColor:
        type === "success"
          ? "var(--success)"
          : type === "error"
          ? "var(--destructive)"
          : type === "warning"
          ? "var(--warning)"
          : "var(--info)",
    },
  });
};

export { Toaster, showToast };
