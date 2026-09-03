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
    <div className="fixed right-4 top-5 z-[9999] w-[calc(100%-2rem)] max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3 rounded-md border border-neutral-200/90 bg-white/95 p-3.5 shadow-md backdrop-blur-xs">

        <Icon
          size={18}
          className={`shrink-0 ${selected.iconClass}`}
        />

        <p className="flex-1 text-xs font-medium leading-snug text-[#1F1F1F]">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-gray-400 transition hover:text-[#1F1F1F]"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>

      </div>
    </div>
  );
}