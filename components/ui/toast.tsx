"use client";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

export default function Toast({
  type,
  message,
  onClose,
}: ToastProps) {
  const config = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
    },

    error: {
      icon: XCircle,
      iconClass: "text-red-500",
    },

    warning: {
      icon: AlertTriangle,
      iconClass: "text-yellow-500",
    },

    info: {
      icon: Info,
      iconClass: "text-blue-500",
    },
  };

  const selected = config[type];
  const Icon = selected.icon;

  return (
    <div className="fixed right-4 top-5 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-start gap-3 rounded-lg border border-[#ECE6E1] bg-white p-4 shadow-lg">

        <Icon
          size={21}
          className={`mt-0.5 shrink-0 ${selected.iconClass}`}
        />

        <p className="flex-1 text-sm font-medium leading-6 text-[#2E2E2E]">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-[#999] transition hover:text-[#2E2E2E]"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>

      </div>
    </div>
  );
}