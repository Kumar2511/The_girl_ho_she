"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingSocialButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3">
      {/* Instagram */}
      <a
        href="https://www.instagram.com/the_girl_ho_se/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/+918870734341"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <MessageCircle size={23} strokeWidth={2} />
      </a>
    </div>
  );
}