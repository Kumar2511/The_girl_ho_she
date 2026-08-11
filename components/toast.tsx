"use client";

import { CheckCircle2, X, AlertCircle } from "lucide-react";

type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="flex items-start gap-3 rounded-2xl border border-[#E8DFD9] bg-white p-4 shadow-[0_15px_45px_rgba(50,30,20,0.18)]">

        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            type === "success"
              ? "bg-[#EDF5E9]"
              : "bg-red-50"
          }`}
        >
          {type === "success" ? (
            <CheckCircle2
              size={19}
              className="text-[#55734E]"
            />
          ) : (
            <AlertCircle
              size={19}
              className="text-red-500"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#3A302D]">
            {type === "success"
              ? "Success"
              : "Something went wrong"}
          </p>

          <p className="mt-0.5 text-xs leading-5 text-[#817772]">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={15} />
        </button>

      </div>
    </div>
  );
}