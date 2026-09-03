"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/cart-drawer";
import { useScrollLock } from "@/hooks/useScrollLock";

/* =========================================================
   NAVIGATION
========================================================= */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop All", href: "/shop" },
  { name: "Antique Jewellery", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "Reviews", href: "/reviews" },
];



/* =========================================================
   PRODUCT TYPE
========================================================= */

type Product = {
  _id: string;
  name: string;
  price?: number;
  discountPrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  stock?: number;
  status?: string;
};

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const router = useRouter();

  const searchRef =
    useRef<HTMLDivElement | null>(null);
  const antiqueRef =
    useRef<HTMLDivElement | null>(null);
  const desktopAccountRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     STATE
  ======================================================= */

  const [isMobileMounted, setIsMobileMounted] = useState(false);
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  const [isDesktopAccountMounted, setIsDesktopAccountMounted] = useState(false);
  const [isDesktopAccountVisible, setIsDesktopAccountVisible] = useState(false);

  const openDesktopAccount = () => {
    setIsDesktopAccountMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDesktopAccountVisible(true);
      });
    });
  };

  const closeDesktopAccount = () => {
    setIsDesktopAccountVisible(false);
    setTimeout(() => {
      setIsDesktopAccountMounted(false);
    }, 240);
  };

  const toggleDesktopAccount = () => {
    if (isDesktopAccountVisible) {
      closeDesktopAccount();
    } else {
      openDesktopAccount();
    }
  };

  const openMobileMenu = () => {
    setIsMobileMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMobileVisible(true);
      });
    });
  };

  const closeMobileMenu = () => {
    setIsMobileVisible(false);
    setTimeout(() => {
      setIsMobileMounted(false);
      setCategoriesOpen(false);
      setAccountSectionOpen(false);
      setMobilePanel("main");
    }, 300);
  };

  const toggleMobileMenu = () => {
    if (isMobileVisible) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const [mobilePanel, setMobilePanel] =
    useState<"main" | "antique">("main");

  const [categoriesOpen, setCategoriesOpen] =
    useState(false);

  const [isAntiqueOpen, setIsAntiqueOpen] =
    useState(false);

  const [accountSectionOpen, setAccountSectionOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [isClosingSearch, setIsClosingSearch] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const closeSearch = () => {
    setIsClosingSearch(true);
    setTimeout(() => {
      setSearchOpen(false);
      setIsClosingSearch(false);
    }, 260);
  };

  const openSearch = () => {
    setIsClosingSearch(false);
    setSearchOpen(true);
    if (isMobileVisible) {
      closeMobileMenu();
    }
  };

  useScrollLock(searchOpen);

  /* =======================================================
     CONTEXTS
  ======================================================= */

  const { cart, openCart } = useCart();

  const { wishlist } = useWishlist();

  const { user, logout } = useAuth();

  const cartCount = cart?.length || 0;

  const wishlistCount = wishlist?.length || 0;

  const [navCategories, setNavCategories] = useState<string[]>([]);
  const [navCollections, setNavCollections] = useState<{ name: string; query: string }[]>([]);

  /* =======================================================
     FETCH PRODUCTS FOR SEARCH & TAXONOMY
  ======================================================= */

  useEffect(() => {
    const fetchNavTaxonomy = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/collections`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData.categories) && catData.categories.length > 0) {
            setNavCategories(catData.categories.filter((c: any) => c.isActive !== false).map((c: any) => c.name));
          }
        }

        if (colRes.ok) {
          const colData = await colRes.json();
          if (Array.isArray(colData.collections) && colData.collections.length > 0) {
            setNavCollections(colData.collections.filter((c: any) => c.isActive !== false).map((c: any) => ({
              name: c.name,
              query: `collection=${encodeURIComponent(c.name)}`,
            })));
          }
        }
      } catch (err) {
        console.error("Navbar taxonomy fetch error:", err);
      }
    };
    fetchNavTaxonomy();
  }, []);

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setSearchLoading(true);

          const response =
            await fetch(
              `${
                process.env
                  .NEXT_PUBLIC_API_URL ||
                "http://localhost:5000/api"
              }/products`
            );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch products"
            );
          }

          const data =
            await response.json();

          const fetched =
            data?.products || [];

          const activeProducts =
            fetched.filter(
              (product: Product) =>
                product.status ===
                  undefined ||
                product.status ===
                  "active"
            );

          setProducts(
            activeProducts
          );
        } catch (error) {
          console.error(
            "Navbar search products error:",
            error
          );

          setProducts([]);
        } finally {
          setSearchLoading(false);
        }
      };

    fetchProducts();
  }, []);

  /* =======================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick =
      (event: MouseEvent) => {
        if (
          searchRef.current &&
          !searchRef.current.contains(
            event.target as Node
          )
        ) {
          setSearchOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =======================================================
     CLOSE ANTIQUE DROPDOWN WHEN CLICKING OUTSIDE OR ESCAPE
  ======================================================= */

  useEffect(() => {
    const handleAntiqueOutsideClick = (event: MouseEvent) => {
      if (
        antiqueRef.current &&
        !antiqueRef.current.contains(event.target as Node)
      ) {
        setIsAntiqueOpen(false);
      }
    };

    const handleAntiqueKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAntiqueOpen(false);
      }
    };

    const handleOpenAntiqueCustomEvent = () => {
      openMobileMenu();
      setMobilePanel("antique");
    };

    const handleDesktopAccountOutsideClick = (event: MouseEvent) => {
      if (
        desktopAccountRef.current &&
        !desktopAccountRef.current.contains(event.target as Node)
      ) {
        if (isDesktopAccountVisible) {
          closeDesktopAccount();
        }
      }
    };

    const handleDesktopAccountKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDesktopAccountVisible) {
        closeDesktopAccount();
      }
    };

    window.addEventListener("open-antique-jewellery", handleOpenAntiqueCustomEvent);
    document.addEventListener("mousedown", handleAntiqueOutsideClick);
    document.addEventListener("keydown", handleAntiqueKeyDown);
    document.addEventListener("mousedown", handleDesktopAccountOutsideClick);
    document.addEventListener("keydown", handleDesktopAccountKeyDown);

    return () => {
      window.removeEventListener("open-antique-jewellery", handleOpenAntiqueCustomEvent);
      document.removeEventListener("mousedown", handleAntiqueOutsideClick);
      document.removeEventListener("keydown", handleAntiqueKeyDown);
      document.removeEventListener("mousedown", handleDesktopAccountOutsideClick);
      document.removeEventListener("keydown", handleDesktopAccountKeyDown);
    };
  }, [isDesktopAccountVisible]);

  /* =======================================================
     BODY SCROLL LOCK WHEN MOBILE DRAWER IS OPEN
  ======================================================= */

  useScrollLock(isMobileVisible);

  /* =======================================================
     SEARCH TERM
  ======================================================= */

  const searchTerm =
    search
      .trim()
      .toLowerCase();

  /* =======================================================
     SEARCH SUGGESTIONS

     IMPORTANT:
     We DO NOT use collectionList here.

     Suggestions are generated from:
     - Product names
     - Product categories

     This prevents the whole category catalog
     from appearing when user types "n".
  ======================================================= */

  const searchSuggestions =
    searchTerm
      ? Array.from(
          new Set(
            products
              .flatMap((product) => [
                product.name,
                product.category,
              ])
              .filter(
                (
                  value
                ): value is string =>
                  Boolean(value)
              )
              .filter((value) =>
                value
                  .toLowerCase()
                  .includes(searchTerm)
              )
          )
        )
          .sort((a, b) => {
            const aLower =
              a.toLowerCase();

            const bLower =
              b.toLowerCase();

            /*
              Prefer suggestions that START
              with the entered keyword.
            */

            const aStarts =
              aLower.startsWith(
                searchTerm
              );

            const bStarts =
              bLower.startsWith(
                searchTerm
              );

            if (
              aStarts &&
              !bStarts
            ) {
              return -1;
            }

            if (
              !aStarts &&
              bStarts
            ) {
              return 1;
            }

            return a.length - b.length;
          })
          .slice(0, 7)
      : [];

  /* =======================================================
     MATCHING PRODUCTS
  ======================================================= */

  const matchingProducts =
    searchTerm
      ? products.filter(
          (product) => {
            const name =
              product.name
                ?.toLowerCase() ||
              "";

            const category =
              product.category
                ?.toLowerCase() ||
              "";

            return (
              name.includes(
                searchTerm
              ) ||
              category.includes(
                searchTerm
              )
            );
          }
        )
      : [];

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch =
    () => {
      const value =
        search.trim();

      /*
        IMPORTANT:
        Clicking the search icon itself
        ONLY opens the search UI.

        Navigation happens only when:
        - Enter is pressed
        - Search submit button is clicked
        - "Search for..." is clicked
      */

      if (!value) {
        setSearchOpen(false);
        return;
      }

      setSearchOpen(false);
      closeMobileMenu();

      router.push(
        `/shop?search=${encodeURIComponent(
          value
        )}`
      );
    };

  /* =======================================================
     SEARCH KEYBOARD
  ======================================================= */

  const handleSearchKeyDown =
    (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (
        e.key === "Enter"
      ) {
        e.preventDefault();

        handleSearch();
      }

      if (
        e.key === "Escape"
      ) {
        setSearchOpen(false);
      }
    };

  /* =======================================================
     SUGGESTION CLICK
  ======================================================= */

  const handleSuggestionClick =
    (
      suggestion: string
    ) => {
      /*
        Do NOT navigate immediately.

        Just put the suggestion
        inside the search box.
      */

      setSearch(
        suggestion
      );

      setSearchOpen(true);
    };

  /* =======================================================
     COLLECTION CLICK
     Used by MOBILE CATEGORIES.
  ======================================================= */

  const handleCollectionClick =
    (
      collection: string
    ) => {
      setSearchOpen(false);
      closeMobileMenu();
      setCategoriesOpen(false);

      router.push(
        `/shop?category=${encodeURIComponent(
          collection
        )}`
      );
    };

  /* =======================================================
     PRODUCT CLICK
  ======================================================= */

  const handleProductClick =
    (
      productId: string
    ) => {
      setSearchOpen(false);
      closeMobileMenu();

      router.push(
        `/shop/${productId}`
      );
    };

  /* =======================================================
     CHECKOUT NAVBAR SUPPRESSION
  ======================================================= */
  const pathname = usePathname();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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

  const isCheckoutRoute =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/payment") ||
    isCheckoutModalOpen;

  if (isCheckoutRoute) {
    return null;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          MAIN NAVBAR
      =================================================== */}

      <header
        className="
          sticky
          top-0
          z-[250]
          w-full
          border-b
          border-[#EEE5DE]
          bg-white
        "
      >

        {/* =================================================
            MAIN HEADER ROW
        ================================================= */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1450px]
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              relative
              flex
              h-[64px]
              items-center
              justify-between
              sm:h-[70px]
            "
          >

            {/* =================================================
                MOBILE LEFT SIDE
                MENU + SEARCH
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-1
                lg:hidden
              "
            >

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={toggleMobileMenu}
                aria-label={
                  isMobileVisible
                    ? "Close menu"
                    : "Open menu"
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-[#3A302D]
                  transition
                  hover:text-[#A86C58]
                "
              >
                {isMobileVisible ? (
                  <X
                    className="
                      h-5
                      w-5
                    "
                  />
                ) : (
                  <Menu
                    className="
                      h-5
                      w-5
                    "
                  />
                )}
              </button>

              {/* MOBILE SEARCH */}

              <button
                type="button"
                onClick={openSearch}
                aria-label="Search jewellery"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-[#3A302D]
                  transition
                  hover:text-[#A86C58]
                "
              >
                <Search
                  className="
                    h-[18px]
                    w-[18px]
                  "
                />
              </button>

            </div>

            {/* =================================================
                DESKTOP SEARCH
                LEFT SIDE OF LOGO
            ================================================= */}

            <button
              type="button"
              onClick={openSearch}
              aria-label="Search jewellery"
              className="
                hidden
                h-10
                w-10
                items-center
                justify-center
                text-[#3A302D]
                transition
                hover:text-[#A86C58]
                lg:flex
              "
            >
              <Search
                className="
                  h-[18px]
                  w-[18px]
                "
              />
            </button>

            {/* =================================================
                CENTER — BRAND
            ================================================= */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-center
              "
            >
              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <span
                  className="
                    mb-0.5
                    text-[11px]
                    leading-none
                    text-[#C98F7B]
                  "
                >
                  ✦
                </span>

                <span
                  className="
                    whitespace-nowrap
                    font-serif
                    text-[18px]
                    leading-none
                    tracking-[-0.02em]
                    text-[#5A3542]
                    sm:text-[24px]
                  "
                >
                  The_girl_ho_se
                </span>

                <span
                  className="
                    mt-1
                    text-[6px]
                    uppercase
                    tracking-[0.3em]
                    text-[#9A7B70]
                    sm:text-[8px]
                  "
                >
                  Jewellery
                </span>

              </div>
            </Link>

            {/* =================================================
                RIGHT SIDE
                WISHLIST + ACCOUNT + CART
            ================================================= */}

            <div
              className="
                ml-auto
                flex
                items-center
                gap-1
              "
            >

              {/* =================================================
                  WISHLIST
              ================================================= */}

              <Link
                href="/wishlist"
                onClick={() => {
                  closeMobileMenu();
                  setCategoriesOpen(false);
                  setAccountSectionOpen(false);
                }}
                aria-label="Wishlist"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-[#3A302D]
                  transition
                  hover:text-[#A86C58]
                "
              >
                <Heart
                  className="
                    h-[18px]
                    w-[18px]
                  "
                />

                {wishlistCount >
                  0 && (
                  <span
                    className="
                      absolute
                      right-0.5
                      top-0.5
                      flex
                      h-[16px]
                      min-w-[16px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#CB8161]
                      px-1
                      text-[8px]
                      font-bold
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* =================================================
                  DESKTOP ACCOUNT
              ================================================= */}

              <div
                ref={desktopAccountRef}
                className="
                  relative
                  hidden
                  items-center
                  lg:flex
                "
              >
                <button
                  type="button"
                  onClick={toggleDesktopAccount}
                  aria-label="Account options"
                  aria-expanded={isDesktopAccountVisible}
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    px-3
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-[#4A403D]
                    transition
                    hover:text-[#A86C58]
                  "
                >
                  <User
                    className="
                      h-[16px]
                      w-[16px]
                    "
                  />

                  <span className="max-w-[110px] truncate">
                    {user ? user.name || "My Account" : "Account"}
                  </span>

                  <ArrowRight
                    size={12}
                    className={`text-[#B99A8E] transition-transform duration-200 ${
                      isDesktopAccountVisible ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN MENU (TOP TO BOTTOM ANIMATION) */}

                {isDesktopAccountMounted && (
                  <div
                    className={`
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-48
                      rounded-xl
                      border
                      border-[#EEE5DE]
                      bg-white
                      p-2
                      shadow-xl
                      transition-all
                      duration-200
                      ease-out
                      z-[300]
                      ${
                        isDesktopAccountVisible
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                      }
                    `}
                  >
                    {user ? (
                      <>
                        <Link
                          href="/wishlist"
                          onClick={closeDesktopAccount}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#3A302D] transition hover:bg-[#FAF5F2] hover:text-[#CB8161]"
                        >
                          <Heart size={14} className="text-[#A86C58]" />
                          <span>Wishlist</span>
                        </Link>

                        <Link
                          href="/account"
                          onClick={closeDesktopAccount}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#3A302D] transition hover:bg-[#FAF5F2] hover:text-[#CB8161]"
                        >
                          <User size={14} className="text-[#A86C58]" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          href="/account/orders"
                          onClick={closeDesktopAccount}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#3A302D] transition hover:bg-[#FAF5F2] hover:text-[#CB8161]"
                        >
                          <ShoppingBag size={14} className="text-[#A86C58]" />
                          <span>My Orders</span>
                        </Link>

                        <div className="my-1 border-t border-[#F3ECE7]" />

                        <button
                          type="button"
                          onClick={() => {
                            closeDesktopAccount();
                            logout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <ArrowRight size={14} className="rotate-180" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={closeDesktopAccount}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#3A302D] transition hover:bg-[#FAF5F2] hover:text-[#CB8161]"
                        >
                          <User size={14} className="text-[#A86C58]" />
                          <span>Login</span>
                        </Link>

                        <Link
                          href="/register"
                          onClick={closeDesktopAccount}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#3A302D] transition hover:bg-[#FAF5F2] hover:text-[#CB8161]"
                        >
                          <ArrowRight size={14} className="text-[#A86C58]" />
                          <span>Register</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  CART
              ================================================= */}

              <button
                type="button"
                onClick={openCart}
                aria-label="Open cart"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-[#3A302D]
                  transition
                  hover:text-[#A86A58]
                "
              >
                <ShoppingBag
                  className="
                    h-[19px]
                    w-[19px]
                  "
                />

                {cartCount >
                  0 && (
                  <span
                    className="
                      absolute
                      right-0.5
                      top-0.5
                      flex
                      h-[16px]
                      min-w-[16px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#CB8161]
                      px-1
                      text-[8px]
                      font-bold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
    SEARCH OVERLAY
================================================= */}

{searchOpen && (
  <div
    className="
      fixed
      inset-0
      z-[150]
      flex
      flex-col
      items-center
      justify-start
      px-3
      pt-[72px]
      sm:px-4
      sm:pt-[84px]
      lg:pt-[96px]
    "
    role="dialog"
    aria-modal="true"
    aria-label="Search jewellery"
  >

    {/* =================================================
        BACKDROP
        - Blur homepage
        - Darken homepage
        - Click outside = close search
    ================================================= */}

    <button
      type="button"
      aria-label="Close search"
      onClick={closeSearch}
      className={`
        fixed
        inset-0
        h-full
        w-full
        cursor-default
        bg-black/35
        backdrop-blur-xs
        ${isClosingSearch ? "animate-backdrop-fade-out" : "animate-backdrop-fade"}
      `}
    />

    {/* =================================================
        SEARCH PANEL
    ================================================= */}

    <div
      ref={searchRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
        relative
        z-10
        w-full
        max-w-[760px]

        overflow-hidden
        rounded-[18px]

        border
        border-[#E5D9D2]

        bg-white

        shadow-[0_25px_70px_rgba(50,30,20,0.25)]

        ${isClosingSearch ? "animate-navbar-search-close" : "animate-navbar-search-open"}
      `}
    >

      {/* =================================================
          SEARCH INPUT
      ================================================= */}

      <div
        className="
          border-b
          border-[#EEE5DE]
          bg-white
          p-4
          sm:p-5
        "
      >

        <div
          className="
            relative
            flex
            items-center
          "
        >

          {/* Search icon */}

          <Search
            className="
              pointer-events-none
              absolute
              left-4
              h-[17px]
              w-[17px]
              text-[#9A8279]
            "
          />

          {/* Input */}

          <input
            ref={(element) => {
              if (element) {
                element.focus();
              }
            }}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search jewellery..."
            aria-label="Search jewellery"
            className="
              h-[52px]
              w-full

              rounded-[12px]

              border
              border-[#D8C7BE]

              bg-white

              pl-11
              pr-12

              text-[14px]
              text-[#3A302D]

              outline-none

              placeholder:text-[#A8948C]

              focus:border-[#5A3542]
            "
          />

          {/* Search submit */}

          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="
              absolute
              right-2
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-full

              text-[#5A3542]

              transition

              hover:bg-[#F7F0EC]
            "
          >
            <Search
              className="
                h-[18px]
                w-[18px]
              "
            />
          </button>

        </div>

      </div>

      {/* =================================================
          SEARCH CONTENT
      ================================================= */}

      {search.trim() && (
        <div
          className="
            max-h-[65vh]
            overflow-y-auto
            overscroll-contain
          "
        >

          {searchLoading ? (

            <div
              className="
                px-5
                py-10
                text-center
                text-sm
                text-[#8D7B73]
              "
            >
              Searching...
            </div>

          ) : (

            <>

              {/* =================================================
                  DESKTOP — TWO COLUMNS
                  MOBILE — ONE COLUMN
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                "
              >

                {/* =================================================
                    SUGGESTIONS
                    Generated from actual product names/categories.
                    Do not show the full category catalog here.
                ================================================= */}

                {searchSuggestions.length > 0 && (
                  <div
                    className="
                      border-b
                      border-[#EEE5DE]
                      px-5
                      py-5
                      lg:border-b-0
                      lg:border-r
                    "
                  >
                    <p
                      className="
                        mb-3
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[#A78C82]
                      "
                    >
                      Suggestions
                    </p>

                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() =>
                            handleSuggestionClick(suggestion)
                          }
                          className="
                            flex
                            w-full
                            items-center
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-[14px]
                            text-[#3A302D]
                            transition
                            hover:bg-[#FAF5F2]
                            hover:text-[#A86C58]
                          "
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {matchingProducts.length > 0 && (
                  <div
                    className="
                      px-5
                      py-5
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-[#A78C82]
                        "
                      >
                        Products
                      </p>

                      <span
                        className="
                          text-[10px]
                          text-[#A38B82]
                        "
                      >
                        {matchingProducts.length}
                        {" "}found
                      </span>

                    </div>

                    <div className="space-y-1">

                      {matchingProducts
                        .slice(0, 6)
                        .map((product) => {

                          const image =
                            product.image ||
                            product.images?.[0] ||
                            "/placeholder-product.jpg";

                          return (
                            <button
                              key={product._id}
                              type="button"
                              onClick={() =>
                                handleProductClick(
                                  product._id
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3

                                rounded-xl

                                p-2

                                text-left

                                transition

                                hover:bg-[#FAF5F2]
                              "
                            >

                              {/* PRODUCT IMAGE */}

                              <div
                                className="
                                  relative
                                  h-14
                                  w-14
                                  shrink-0

                                  overflow-hidden
                                  rounded-lg

                                  bg-[#F7F2EF]
                                "
                              >

                                <img
                                  src={image}
                                  alt={product.name}
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />

                              </div>

                              {/* PRODUCT DETAILS */}

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >

                                <p
                                  className="
                                    truncate
                                    text-[13px]
                                    font-semibold
                                    text-[#3A302D]
                                  "
                                >
                                  {product.name}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-[10px]
                                    text-[#8D7B73]
                                  "
                                >
                                  {product.category}
                                </p>

                                {product.price !==
                                  undefined && (
                                  <p
                                    className="
                                      mt-1
                                      text-xs
                                      font-semibold
                                      text-[#8D4E67]
                                    "
                                  >
                                    ₹
                                    {Number(
                                      product.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                )}

                              </div>

                              <ArrowRight
                                size={14}
                                className="
                                  shrink-0
                                  text-[#B99A8E]
                                "
                              />

                            </button>
                          );
                        })}

                    </div>

                  </div>
                )}

              </div>

              {/* =================================================
                  NO RESULTS
              ================================================= */}

              {searchSuggestions.length === 0 &&
                matchingProducts.length === 0 && (

                <div
                  className="
                    px-5
                    py-10
                    text-center
                  "
                >

                  <div className="mb-2 text-xl">
                    🔍
                  </div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#3A302D]
                    "
                  >
                    No results found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#8D7B73]
                    "
                  >
                    Try another jewellery name
                    or collection.
                  </p>

                </div>

              )}

              {/* =================================================
                  VIEW ALL RESULTS
              ================================================= */}

              {(searchSuggestions.length > 0 ||
                matchingProducts.length > 0) && (

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between

                    border-t
                    border-[#EEE5DE]

                    bg-[#FAF7F4]

                    px-5
                    py-4

                    text-sm
                    font-semibold
                    text-[#5A3542]

                    transition

                    hover:bg-[#F5ECE7]
                  "
                >

                  <span>
                    Search for "{search.trim()}"
                  </span>

                  <ArrowRight size={15} />

                </button>

              )}

            </>

          )}

        </div>
      )}

    </div>

  </div>
)}

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="
            hidden
            border-t
            border-[#F3ECE7]
            lg:block
          "
        >
          <div
            className="
              mx-auto
              flex
              h-11
              max-w-[1450px]
              items-center
              justify-center
              px-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-8
              "
            >

              {navLinks.map((item) => {
                const isAntique = item.name === "Antique Jewellery";

                if (isAntique) {
                  return (
                    <div key="antique-jewellery-nav" ref={antiqueRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsAntiqueOpen((curr) => !curr)}
                        className={`relative flex items-center gap-1 py-3 text-[11px] font-medium uppercase tracking-[0.13em] transition ${
                          isAntiqueOpen ? "text-[#C78B7B]" : "text-[#4A403D] hover:text-[#A86C58]"
                        }`}
                      >
                        {item.name}
                        <span className={`text-[9px] opacity-60 transition-transform duration-200 ${isAntiqueOpen ? "rotate-180" : ""}`}>
                          ▾
                        </span>
                      </button>

                      {/* ANTIQUE JEWELLERY DISCOVERY DROPDOWN (CLICK ONLY) */}
                      {isAntiqueOpen && (
                        <div className="animate-dropdown-fade absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/2 rounded-2xl border border-[#EBE3DE] bg-white p-6 shadow-2xl">
                          <div className="grid grid-cols-2 gap-8">
                            {/* CATEGORIES COLUMN */}
                            <div>
                              <div className="mb-3 flex items-center justify-between border-b border-[#F4EEE9] pb-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C78B7B]">
                                  Categories
                                </span>
                                <Link
                                  href="/shop"
                                  onClick={() => setIsAntiqueOpen(false)}
                                  className="text-[10px] font-semibold text-[#3A2528] underline hover:text-[#C78B7B]"
                                >
                                  View All
                                </Link>
                              </div>

                              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                {navCategories.map((cat) => (
                                  <Link
                                    key={cat}
                                    href={`/shop?category=${encodeURIComponent(cat)}`}
                                    onClick={() => setIsAntiqueOpen(false)}
                                    className="rounded-lg px-2 py-1.5 text-xs text-[#4A403D] transition hover:bg-[#FDFBF7] hover:text-[#C78B7B]"
                                  >
                                    ✦ {cat}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* COLLECTIONS COLUMN */}
                            <div>
                              <div className="mb-3 flex items-center justify-between border-b border-[#F4EEE9] pb-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C78B7B]">
                                  Collections
                                </span>
                                <Link
                                  href="/collections"
                                  onClick={() => setIsAntiqueOpen(false)}
                                  className="text-[10px] font-semibold text-[#3A2528] underline hover:text-[#C78B7B]"
                                >
                                  Explore All
                                </Link>
                              </div>

                              <div className="grid grid-cols-1 gap-y-1">
                                {navCollections.map((col) => (
                                  <Link
                                    key={col.name}
                                    href={`/shop?${col.query}`}
                                    onClick={() => setIsAntiqueOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-[#4A403D] transition hover:bg-[#FDFBF7] hover:text-[#C78B7B]"
                                  >
                                    <span>✨ {col.name}</span>
                                    <span className="text-[10px] opacity-40">→</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className="relative flex items-center gap-1 py-3 text-[11px] font-medium uppercase tracking-[0.13em] text-[#4A403D] transition hover:text-[#A86C58]"
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              })}

            </div>

          </div>
        </nav>

        {/* =================================================
            MOBILE MENU DRAWER
        ================================================= */}

        {isMobileMounted && (
          <div
            className="
              fixed
              inset-x-0
              bottom-0
              top-[64px]
              z-[200]
              overflow-hidden
              sm:top-[70px]
              lg:hidden
            "
            role="dialog"
            aria-modal="true"
          >

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className={`
                absolute
                inset-0
                bg-black/40
                backdrop-blur-xs
                transition-opacity
                duration-300
                ${isMobileVisible ? "opacity-100" : "opacity-0"}
              `}
            />

            {/* DRAWER (HALF-SCREEN MOBILE WIDTH) */}

            <aside
              data-scrollable="true"
              className={`
                absolute
                left-0
                top-0
                flex
                h-full
                w-[72%]
                max-w-[280px]
                flex-col
                border-r
                border-[#EEE5DE]
                bg-white
                shadow-2xl
                transition-transform
                duration-300
                ease-out
                ${isMobileVisible ? "translate-x-0" : "-translate-x-full"}
              `}
              onClick={(e) => e.stopPropagation()}
            >

              {/* =================================================
                  NAVIGATION AREA
              ================================================= */}

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  overscroll-contain
                "
              >

                  {/* =================================================
                      MENU
                  ================================================= */}

                  <nav
                    className="
                      border-b
                      border-[#EEE5DE]
                    "
                  >

                    <div
                      className="
                        px-5
                        py-3
                      "
                    >

                      {mobilePanel === "main" ? (
                        /* PANEL 1: MAIN MENU */
                        <div className="animate-panel-in-left space-y-1">
                          {/* HOME */}
                          <Link
                            href="/"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between border-b border-[#F3ECE7] py-3.5 text-[14px] font-medium text-[#3A302D]"
                          >
                            <span>Home</span>
                            <ArrowRight size={14} className="text-[#B99A8E]" />
                          </Link>

                          {/* ANTIQUE JEWELLERY (SLIDES TO PANEL 2) */}
                          <button
                            type="button"
                            onClick={() => setMobilePanel("antique")}
                            className="flex w-full items-center justify-between border-b border-[#F3ECE7] py-3.5 text-[14px] font-medium text-[#3A302D]"
                          >
                            <span className="flex items-center gap-2">
                              <span>Antique Jewellery</span>
                              <span className="rounded-full bg-[#F5EBE6] px-2 py-0.5 text-[10px] font-bold text-[#C78B7B]">
                                Explore
                              </span>
                            </span>
                            <ArrowRight size={14} className="text-[#B99A8E]" />
                          </button>

                          {/* REVIEWS */}
                          <Link
                            href="/reviews"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between py-3.5 text-[14px] font-medium text-[#3A302D]"
                          >
                            <span>Reviews</span>
                            <ArrowRight size={14} className="text-[#B99A8E]" />
                          </Link>
                        </div>
                      ) : (
                        /* PANEL 2: ANTIQUE JEWELLERY SUBMENU */
                        <div className="animate-panel-in-right max-h-[55vh] space-y-4 overflow-y-auto overscroll-contain pr-1">
                          {/* BACK BUTTON */}
                          <button
                            type="button"
                            onClick={() => setMobilePanel("main")}
                            className="flex items-center gap-2 rounded-xl bg-[#F5EBE6] px-3.5 py-2 text-xs font-semibold text-[#3A2528] transition hover:bg-[#E8D9D1]"
                          >
                            <span>←</span>
                            <span>Main Menu</span>
                          </button>

                          {/* CATEGORIES SECTION */}
                          {navCategories.length > 0 && (
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C78B7B]">
                                Categories
                              </p>
                              <div className="grid grid-cols-1 gap-1 border-l-2 border-[#C78B7B]/30 pl-3">
                                {navCategories.map((cat) => (
                                  <Link
                                    key={cat}
                                    href={`/shop?category=${encodeURIComponent(cat)}`}
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between py-2 text-xs font-medium text-[#4A403D] hover:text-[#C78B7B]"
                                  >
                                    <span>✦ {cat}</span>
                                    <span className="text-[10px] opacity-40">→</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* COLLECTIONS SECTION */}
                          {navCollections.length > 0 && (
                            <div className="border-t border-[#F3ECE7] pt-3">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C78B7B]">
                                Collections
                              </p>
                              <div className="grid grid-cols-1 gap-1 border-l-2 border-[#C78B7B]/30 pl-3">
                                {navCollections.map((col) => (
                                  <Link
                                    key={col.name}
                                    href={`/shop?${col.query}`}
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between py-2 text-xs font-medium text-[#4A403D] hover:text-[#C78B7B]"
                                  >
                                    <span>✨ {col.name}</span>
                                    <span className="text-[10px] opacity-40">→</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                  </nav>

                  {/* FLEXIBLE SPACE */}

                  <div
                    className="
                      min-h-[40px]
                    "
                  />

              </div>

              {/* =================================================
                  ACCOUNT — BOTTOM
              ================================================= */}

              <div
                className="
                  shrink-0
                  border-t
                  border-[#EEE5DE]
                  bg-white
                "
              >

                {!user ? (
                  <>
                    {/* =================================================
                        LOGGED OUT
                    ================================================= */}

                    <div
                      className="
                        px-5
                        py-4
                      "
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setAccountSectionOpen(
                            (current) =>
                              !current
                          );

                          setCategoriesOpen(
                            false
                          );
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          text-left
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <User
                            className="
                              h-4
                              w-4
                              text-[#A86C58]
                            "
                          />

                          <span
                            className="
                              text-[14px]
                              font-medium
                              text-[#3A302D]
                            "
                          >
                            My Account 
                          </span>

                        </div>

                        <ArrowRight
                          size={
                            14
                          }
                          className={`
                            text-[#B99A8E]
                            transition-transform
                            ${
                              accountSectionOpen
                                ? "rotate-90"
                                : ""
                            }
                          `}
                        />

                      </button>

                      {/* LOGIN OPTIONS */}

                      {accountSectionOpen && (
                        <div
                          className="
                            mt-3
                            border-t
                            border-[#F0E8E3]
                            pt-2
                          "
                        >

                          <Link
                            href="/login"
                            onClick={
                              closeMobileMenu
                            }
                            className="
                              block
                              py-2.5
                              pl-7
                              text-[13px]
                              text-[#3A302D]
                            "
                          >
                            Login
                          </Link>

                          <Link
                            href="/register"
                            onClick={
                              closeMobileMenu
                            }
                            className="
                              block
                              py-2.5
                              pl-7
                              text-[13px]
                              text-[#3A302D]
                            "
                          >
                            Register
                          </Link>

                        </div>
                      )}

                    </div>
                  </>
                ) : (
                  <>
                    {/* =================================================
                        LOGGED-IN ACCOUNT
                    ================================================= */}

                    <div
                      className="
                        px-5
                        py-4
                      "
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setAccountSectionOpen(
                            (current) =>
                              !current
                          );

                          setCategoriesOpen(
                            false
                          );
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          text-left
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <User
                            className="
                              h-4
                              w-4
                              text-[#A86C58]
                            "
                          />

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                truncate
                                text-[13px]
                                font-medium
                                text-[#3A302D]
                              "
                            >
                              {
                                user.name
                              }
                            </p>

                            <p
                              className="
                                truncate
                                text-[10px]
                                text-[#8D7B73]
                              "
                            >
                              My Account
                            </p>

                          </div>

                        </div>

                        <ArrowRight
                          size={
                            14
                          }
                          className={`
                            text-[#B99A8E]
                            transition-transform
                            ${
                              accountSectionOpen
                                ? "rotate-90"
                                : ""
                            }
                          `}
                        />

                      </button>

                      {/* ACCOUNT OPTIONS */}

                      {accountSectionOpen && (
                        <div
                          className="
                            animate-panel-in-right
                            mt-3
                            border-t
                            border-[#F0E8E3]
                            pt-2
                            space-y-1
                          "
                        >
                          {/* WISHLIST */}

                          <Link
                            href="/wishlist"
                            onClick={closeMobileMenu}
                            className="
                              flex
                              items-center
                              gap-2.5
                              py-2
                              pl-7
                              text-[13px]
                              text-[#3A302D]
                            "
                          >
                            <Heart size={14} className="text-[#A86C58]" />
                            <span>Wishlist</span>
                          </Link>

                          {/* MY ACCOUNT */}

                          <Link
                            href="/account"
                            onClick={closeMobileMenu}
                            className="
                              flex
                              items-center
                              gap-2.5
                              py-2
                              pl-7
                              text-[13px]
                              text-[#3A302D]
                            "
                          >
                            <User size={14} className="text-[#A86C58]" />
                            <span>My Account</span>
                          </Link>

                          {/* MY ORDERS */}

                          <Link
                            href="/account/orders"
                            onClick={closeMobileMenu}
                            className="
                              flex
                              items-center
                              gap-2.5
                              py-2
                              pl-7
                              text-[13px]
                              text-[#3A302D]
                            "
                          >
                            <ShoppingBag size={14} className="text-[#A86C58]" />
                            <span>My Orders</span>
                          </Link>

                          {/* LOGOUT */}

                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              closeMobileMenu();
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              gap-2.5
                              py-2
                              pl-7
                              text-left
                              text-[13px]
                              text-red-600
                            "
                          >
                            <ArrowRight size={14} className="rotate-180" />
                            <span>Logout</span>
                          </button>

                        </div>
                      )}

                    </div>
                  </>
                )}

              </div>

            </aside>

          </div>
        )}

      </header>

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      <CartDrawer />
    </>
  );
}