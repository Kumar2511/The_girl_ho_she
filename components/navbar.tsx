"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

/* =========================================================
   NAVIGATION
========================================================= */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "Reviews", href: "/reviews" },
];

/* =========================================================
   COLLECTIONS
   Used only inside MOBILE CATEGORIES.
   These are NOT shown as search results.
========================================================= */

const collectionList = [
  { name: "Necklace", icon: "📿" },
  { name: "Earrings", icon: "✨" },
  { name: "Bangles", icon: "💫" },
  { name: "Rings", icon: "💍" },
  { name: "Bracelets", icon: "👑" },
  { name: "Anklets", icon: "🦶" },
  { name: "Hair Accessories", icon: "🌸" },
  { name: "Bridal Collection", icon: "👰" },
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

  /* =======================================================
     STATE
  ======================================================= */

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [categoriesOpen, setCategoriesOpen] =
    useState(false);

  const [accountSectionOpen, setAccountSectionOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  /* =======================================================
     CONTEXTS
  ======================================================= */

  const { cart, openCart } = useCart();

  const { wishlist } =
    useWishlist();

  const { user, logout } =
    useAuth();

  const cartCount =
    cart?.length || 0;

  const wishlistCount =
    wishlist?.length || 0;

  /* =======================================================
     MOBILE MENU — LOCK BACKGROUND SCROLL
  ======================================================= */

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [mobileOpen]);

 // ==========================================
// SEARCH — LOCK BACKGROUND SCROLL
// ==========================================

useEffect(() => {
  if (!searchOpen) {
    return;
  }

  const originalOverflow =
    document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow =
      originalOverflow;
  };
}, [searchOpen]);

  /* =======================================================
     FETCH PRODUCTS FOR SEARCH
  ======================================================= */

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
      setMobileOpen(false);

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
      setMobileOpen(false);
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
      setMobileOpen(false);

      router.push(
        `/shop/${productId}`
      );
    };

  /* =======================================================
     CLOSE MOBILE MENU
  ======================================================= */

  const closeMobileMenu =
    () => {
      setMobileOpen(false);
      setCategoriesOpen(false);
      setAccountSectionOpen(false);
    };

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
          relative
          z-50
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
                onClick={() =>
                  setMobileOpen(
                    !mobileOpen
                  )
                }
                aria-label={
                  mobileOpen
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
                {mobileOpen ? (
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
                onClick={() => {
                  setSearchOpen(
                    !searchOpen
                  );

                  setMobileOpen(
                    false
                  );
                }}
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
              onClick={() => {
                setSearchOpen(
                  !searchOpen
                );

                setMobileOpen(
                  false
                );
              }}
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
                  setMobileOpen(false);
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
                      bg-[#B86A6A]
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
                className="
                  hidden
                  items-center
                  gap-1
                  lg:flex
                "
              >

                {!user ? (
                  <>
                    {/* LOGIN */}

                    <Link
                      href="/login"
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

                      <span>
                        Login
                      </span>
                    </Link>

                    {/* REGISTER */}

                    <Link
                      href="/register"
                      className="
                        flex
                        h-10
                        items-center
                        px-2
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.08em]
                        text-[#8D7B73]
                        transition
                        hover:text-[#A86C58]
                      "
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/account/profile"
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

                    <span
                      className="
                        max-w-[110px]
                        truncate
                      "
                    >
                      {user.name ||
                        "My Account"}
                    </span>
                  </Link>
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
                      bg-[#B86A6A]
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
      onClick={() => {
        setSearchOpen(false);
      }}
      className="
        absolute
        inset-0
        h-full
        w-full
        cursor-default
        bg-black/25
        backdrop-blur-[3px]
      "
    />

    {/* =================================================
        SEARCH PANEL
    ================================================= */}

    <div
      ref={searchRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="
        absolute
        left-1/2
        top-[105px]
        w-[calc(100%-32px)]
        max-w-[760px]
        -translate-x-1/2

        overflow-hidden
        rounded-[18px]

        border
        border-[#E5D9D2]

        bg-white

        shadow-[0_25px_70px_rgba(50,30,20,0.25)]

        sm:top-[115px]
        sm:w-[calc(100%-48px)]

        lg:top-[125px]
        lg:w-[760px]
      "
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

              {navLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="
                      relative
                      py-3
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-[#4A403D]
                      transition
                      hover:text-[#A86C58]
                    "
                  >
                    {item.name}
                  </Link>
                )
              )}

            </div>

          </div>
        </nav>

        {/* =================================================
            MOBILE MENU DRAWER
        ================================================= */}

        {mobileOpen && (
          <div
            className="
              fixed
              inset-0
              z-[200]
              lg:hidden
            "
            role="dialog"
            aria-modal="true"
          >

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={
                closeMobileMenu
              }
              className="
                absolute
                inset-0
                bg-black/20
              "
            />

            {/* DRAWER */}

            <aside
              className="
                absolute
                left-0
                top-0
                flex
                h-[100dvh]
                w-[82%]
                max-w-[360px]
                flex-col
                bg-white
                shadow-[10px_0_35px_rgba(50,30,20,0.12)]
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* =================================================
                  DRAWER HEADER
              ================================================= */}

              <div
                className="
                  flex
                  h-[64px]
                  shrink-0
                  items-center
                  border-b
                  border-[#EEE5DE]
                  px-5
                "
              >

                <button
                  type="button"
                  onClick={
                    closeMobileMenu
                  }
                  aria-label="Close menu"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-start
                    text-[#3A302D]
                  "
                >
                  <X
                    className="
                      h-[18px]
                      w-[18px]
                    "
                  />
                </button>

                <Link
                  href="/"
                  onClick={
                    closeMobileMenu
                  }
                  className="
                    absolute
                    left-1/2
                    -translate-x-1/2
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
                        font-serif
                        text-[18px]
                        leading-none
                        text-[#5A3542]
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
                      "
                    >
                      Jewellery
                    </span>

                  </div>

                </Link>

              </div>

              {/* =================================================
                  NAVIGATION AREA
              ================================================= */}

              <div
                className="
                  flex-1
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
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

                      <p
                        className="
                          mb-2
                          text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.22em]
                          text-[#A78C82]
                        "
                      >
                        Menu
                      </p>

                      {/* HOME */}

                      <Link
                        href="/"
                        onClick={
                          closeMobileMenu
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          border-b
                          border-[#F3ECE7]
                          py-3.5
                          text-[14px]
                          text-[#3A302D]
                        "
                      >
                        Home
                      </Link>

                      {/* SHOP */}

                      <Link
                        href="/shop"
                        onClick={
                          closeMobileMenu
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          border-b
                          border-[#F3ECE7]
                          py-3.5
                          text-[14px]
                          text-[#3A302D]
                        "
                      >

                        <span>
                          Shop
                        </span>

                        <ArrowRight
                          size={
                            14
                          }
                          className="
                            text-[#B99A8E]
                          "
                        />

                      </Link>

                      {/* COLLECTIONS */}

                      <Link
                        href="/collections"
                        onClick={
                          closeMobileMenu
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          border-b
                          border-[#F3ECE7]
                          py-3.5
                          text-[14px]
                          text-[#3A302D]
                        "
                      >

                        <span>
                          Collections
                        </span>

                        <ArrowRight
                          size={
                            14
                          }
                          className="
                            text-[#B99A8E]
                          "
                        />

                      </Link>

                      {/* CATEGORIES */}

                      <button
                        type="button"
                        onClick={() => {
                          setCategoriesOpen(
                            (current) =>
                              !current
                          );

                          setAccountSectionOpen(
                            false
                          );
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          border-b
                          border-[#F3ECE7]
                          py-3.5
                          text-left
                          text-[14px]
                          text-[#3A302D]
                        "
                      >

                        <span>
                          Categories
                        </span>

                        <ArrowRight
                          size={
                            14
                          }
                          className={`
                            text-[#B99A8E]
                            transition-transform
                            ${
                              categoriesOpen
                                ? "rotate-90"
                                : ""
                            }
                          `}
                        />

                      </button>

                      {/* CATEGORY CONTENT */}

                      {categoriesOpen && (
                        <div
                          className="
                            border-b
                            border-[#F3ECE7]
                            bg-[#FBF8F6]
                            px-3
                            py-2
                          "
                        >

                          {collectionList.map(
                            (
                              collection
                            ) => (
                              <button
                                key={
                                  collection.name
                                }
                                type="button"
                                onClick={() =>
                                  handleCollectionClick(
                                    collection.name
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  rounded-md
                                  px-3
                                  py-2.5
                                  text-left
                                  text-[13px]
                                  text-[#3A302D]
                                  transition
                                  hover:bg-white
                                  hover:text-[#A86C58]
                                "
                              >

                                <span
                                  className="
                                    w-5
                                    text-sm
                                  "
                                >
                                  {
                                    collection.icon
                                  }
                                </span>

                                <span>
                                  {
                                    collection.name
                                  }
                                </span>

                              </button>
                            )
                          )}

                        </div>
                      )}

                      {/* REVIEWS */}

                      <Link
                        href="/reviews"
                        onClick={
                          closeMobileMenu
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          py-3.5
                          text-[14px]
                          text-[#3A302D]
                        "
                      >
                        Reviews
                      </Link>

                    </div>

                  </nav>

                  {/* FLEXIBLE SPACE */}

                  <div
                    className="
                      min-h-[120px]
                    "
                  />

                </div>

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
                              text-[#3A302D]
                            "
                          >
                            Login
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
                            mt-3
                            border-t
                            border-[#F0E8E3]
                            pt-2
                          "
                        >

                          {/* MY PROFILE */}

                          <Link
                            href="/account"
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
                            My Profile
                          </Link>

                          {/* MY ORDERS */}

                          <Link
                            href="/account/orders"
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
                            My Orders
                          </Link>


                          {/* LOGOUT */}

                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              closeMobileMenu();
                            }}
                            className="
                              block
                              w-full
                              py-2.5
                              pl-7
                              text-left
                              text-[13px]
                              text-red-600
                            "
                          >
                            Logout
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