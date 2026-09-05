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
      iconClass: "text-emerald-600",
    },

    error: {
      icon: XCircle,
      iconClass: "text-rose-600",
    },

    warning: {
      icon: AlertTriangle,
      iconClass: "text-[#CB8161]",
    },

    info: {
      icon: Info,
      iconClass: "text-[#CB8161]",
    },
  };

  const selected = config[type];
  const Icon = selected.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2 sm:left-auto sm:right-6 sm:translate-x-0 sm:max-w-sm"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-[#F0EBE6] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <Icon
          size={18}
          className={`shrink-0 ${selected.iconClass}`}
        />

        <p className="flex-1 font-sans text-xs sm:text-[13px] font-normal leading-snug text-[#252525]">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-gray-400 transition hover:text-[#252525]"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}