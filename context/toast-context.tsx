"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
} from "react";

import Toast from "@/components/ui/toast";

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType
  ) => void;
}

const ToastContext =
  createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const timerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "success"
    ) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        message,
        type,
      });

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 2600);
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}