'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

type SnackbarType = {
  openSnackbar: (message: string, severity?: "success" | "error" | "warning" | "info") => void;
};

const SnackbarContext = createContext<SnackbarType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message: string, severity: "success" | "error" | "warning" | "info" = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
       
      >
        <Alert onClose={handleClose} severity={snackbar.severity}  sx={{ width: isMobile ? "70%" : "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
