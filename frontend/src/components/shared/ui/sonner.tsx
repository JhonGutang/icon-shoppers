"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:border-red-600 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-red-100",
          actionButton:
            "group-[.toast]:bg-red-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-red-400 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster } 