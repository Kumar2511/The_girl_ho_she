"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, X, Sparkles, Star, ChevronRight, MessageSquareText } from "lucide-react";
import FindProductButton from "@/components/shop/FindProductButton";
import api from "@/lib/api";

type AnnouncementItem = {
  type: "product" | "review";
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image?: string;
};

export default function FloatingSocialButtons() {
  const pathname = usePathname();
  const [commMenuOpen, setCommMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Monitor checkout modal state via body class observer
  useEffect(() => {
    if (typeof document === "undefined") return;

    const checkModalState = () => {
      setIsCheckoutModalOpen(document.body.classList.contains("checkout-modal-open"));
    };

    checkModalState();
    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Fetch dynamic announcements (Recent Products & Approved Reviews)
  useEffect(() => {
    let mounted = true;

    const fetchAnnouncements = async () => {
      try {
        const prodsRes = await api.get("/products");
        const prods = Array.isArray(prodsRes.data?.products)
          ? prodsRes.data.products
          : Array.isArray(prodsRes.data)
          ? prodsRes.data
          : [];

        const items: AnnouncementItem[] = [];

        // 1. Add recent products (up to 3)
        if (prods.length > 0) {
          const recentProds = [...prods].reverse().slice(0, 3);
          recentProds.forEach((p: any) => {
            if (p._id && p.name) {
              const img =
                (Array.isArray(p.images) && p.images[0]) ||
                p.image ||
                p.thumbnail ||
                "";
              items.push({
                type: "product",
                id: p._id,
                title: `✨ New Arrival: ${p.name}`,
                subtitle: p.price ? `₹${p.price.toLocaleString("en-IN")}` : "View Product",
                link: `/shop/${p._id}`,
                image: img,
              });
            }
          });
        }

        // 2. Fetch approved reviews from top products
        if (prods.length > 0) {
          for (const p of prods.slice(0, 5)) {
            if (!p._id) continue;
            try {
              const revRes = await api.get(`/reviews/product/${p._id}`);
              const revs = revRes.data?.reviews || [];
              if (revs.length > 0) {
                const latest = revs[0];
                items.push({
                  type: "review",
                  id: latest._id || p._id,
                  title: `★ Verified Review: ${latest.customerName || "Happy Customer"}`,
                  subtitle: `"${(latest.comment || "Loved this jewellery piece!").slice(0, 45)}..."`,
                  link: "/reviews",
                });
                break;
              }
            } catch (err) {
              // ignore review fetch failure for single product
            }
          }
        }

        if (mounted && items.length > 0) {
          setAnnouncements(items);
        }
      } catch (err) {
        console.error("Failed to load floating announcements:", err);
      }
    };

    fetchAnnouncements();

    return () => {
      mounted = false;
    };
  }, []);

  const [animState, setAnimState] = useState<"enter" | "visible" | "exit">("enter");

  // Cycle announcements with smooth enter-from-left and exit-to-right animation
  useEffect(() => {
    if (announcements.length === 0) return;

    setAnimState("enter");

    const enterTimer = setTimeout(() => {
      setAnimState("visible");
    }, 600);

    const exitTimer = setTimeout(() => {
      setAnimState("exit");
    }, 4500);

    const nextTimer = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % announcements.length);
    }, 5200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIdx, announcements.length]);

  // ========================================================
  // ROUTE / CHECKOUT MODAL SUPPRESSION CHECK (AFTER ALL HOOKS)
  // ========================================================
  const isCheckoutOrPaymentRoute =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/payment") ||
    pathname?.startsWith("/order-success") ||
    isCheckoutModalOpen;

  if (isCheckoutOrPaymentRoute) {
    return null;
  }

  const activeAnnouncement = announcements[currentIdx];

  return (
    <>
      {/* ========================================================
          LEFT SIDE — DYNAMIC ANNOUNCEMENT WIDGET (LEFT TO RIGHT SLIDE)
      ======================================================== */}
      {activeAnnouncement && !announcementDismissed && (
        <div
          className={`fixed bottom-5 left-5 z-[100] max-w-[280px] sm:max-w-[320px] transition-all duration-700 ease-in-out ${
            animState === "enter"
              ? "-translate-x-full opacity-0"
              : animState === "visible"
              ? "translate-x-0 opacity-100"
              : "translate-x-[160vw] opacity-0"
          }`}
        >
          <div className="relative flex items-center justify-between gap-2.5 rounded-2xl border border-[#E8DFD9] bg-white/95 p-3.5 shadow-2xl backdrop-blur-md">
            <Link
              href={activeAnnouncement.link}
              className="flex flex-1 items-start gap-3 min-w-0 group"
            >
              {activeAnnouncement.image ? (
                <img
                  src={activeAnnouncement.image}
                  alt={activeAnnouncement.title}
                  className="h-10 w-10 shrink-0 rounded-xl border border-[#ECE4DE] object-cover shadow-xs"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF4F0] text-[#CB8161] shadow-xs">
                  {activeAnnouncement.type === "product" ? (
                    <Sparkles size={16} />
                  ) : (
                    <Star size={16} className="fill-[#CB8161]" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#2E2E2E] group-hover:text-[#CB8161] transition-colors">
                  {activeAnnouncement.title}
                </p>
                <p className="line-clamp-1 text-[11px] text-[#777] mt-0.5">
                  {activeAnnouncement.subtitle}
                </p>
              </div>

              <ChevronRight size={14} className="mt-1 shrink-0 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => setAnnouncementDismissed(true)}
              className="shrink-0 p-1 text-gray-400 hover:text-black transition-colors"
              aria-label="Dismiss announcement"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          RIGHT SIDE — FIND PRODUCT + COMBINED COMM BUTTON
      ======================================================== */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
        {/* Find My Product */}
        <FindProductButton />

        {/* Combined Communication Button */}
        <div className="relative">
          {/* Popover Menu */}
          {commMenuOpen && (
            <div className="absolute bottom-14 right-0 mb-2 flex flex-col gap-2 rounded-2xl border border-[#E8DFD9] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 min-w-[170px]">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/the_girl_ho_se/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCommMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-[#2E2E2E] transition-all hover:bg-[#FAF4F0] hover:text-[#E1306C]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <span>Instagram</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918870734341"}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCommMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-[#2E2E2E] transition-all hover:bg-[#FAF4F0] hover:text-[#25D366]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle size={18} strokeWidth={2} />
                </div>
                <span>WhatsApp</span>
              </a>
            </div>
          )}

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setCommMenuOpen((prev) => !prev)}
            aria-label="Contact Us"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F1F1F] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#CB8161] hover:shadow-2xl active:scale-95"
          >
            {commMenuOpen ? (
              <X size={20} />
            ) : (
              <MessageSquareText size={20} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}