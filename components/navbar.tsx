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
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/cart-drawer";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const collectionList = [
  {
    name: "Necklace",
    icon: "📿",
  },
  {
    name: "Earrings",
    icon: "✨",
  },
  {
    name: "Bangles",
    icon: "💫",
  },
  {
    name: "Rings",
    icon: "💍",
  },
  {
    name: "Bracelets",
    icon: "👑",
  },
  {
    name: "Anklets",
    icon: "🦶",
  },
  {
    name: "Hair Accessories",
    icon: "🌸",
  },
  {
    name: "Bridal Collection",
    icon: "👰",
  },
];

type Product = {
  _id: string;
  name: string;
  price?: number;
  image?: string;
  images?: string[];
  category?: string;
  stock?: number;
  status?: string;
};

export default function Navbar() {
  const router = useRouter();

  const searchRef =
    useRef<HTMLDivElement | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const {
    cart,
    openCart,
  } = useCart();

  const { wishlist } =
    useWishlist();

  const { user, logout } =
    useAuth();

  const cartCount =
    cart?.length || 0;

  const wishlistCount =
    wishlist?.length || 0;

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
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

        setProducts(activeProducts);
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

  // ==========================================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
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

  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  const searchTerm =
    search.trim().toLowerCase();

  const matchingCollections =
    searchTerm
      ? collectionList.filter(
          (collection) =>
            collection.name
              .toLowerCase()
              .includes(searchTerm)
        )
      : [];

  const matchingProducts =
    searchTerm
      ? products
          .filter((product) => {
            const name =
              product.name
                ?.toLowerCase() || "";

            const category =
              product.category
                ?.toLowerCase() || "";

            return (
              name.includes(searchTerm) ||
              category.includes(searchTerm)
            );
          })
          .slice(0, 5)
      : [];

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = () => {
    const value =
      search.trim();

    if (!value) {
      setSearchOpen(false);
      router.push("/shop");
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

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSearch();
    }

    if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  // ==========================================
  // COLLECTION CLICK
  // ==========================================

  const handleCollectionClick = (
    collection: string
  ) => {
    setSearchOpen(false);
    setMobileOpen(false);

    router.push(
      `/shop?category=${encodeURIComponent(
        collection
      )}`
    );
  };

  // ==========================================
  // PRODUCT CLICK
  // ==========================================

  const handleProductClick = (
    productId: string
  ) => {
    setSearchOpen(false);
    setMobileOpen(false);

    router.push(
      `/product/${productId}`
    );
  };

  return (
    <>
      {/* =====================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-50 border-b border-[#EFE8E3] bg-white">

        {/* ===================================
            TOP HEADER
        =================================== */}

        <div className="mx-auto max-w-7xl px-4">

          <div className="relative flex h-14 items-center justify-between">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              className="flex h-8 w-8 items-center justify-center lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* LOGO */}

            <Link
              href="/"
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
            >
              <div className="text-sm leading-none text-pink-500">
                🌸
              </div>

              <h1 className="font-serif text-[24px] leading-none text-[#5A3542]">
                The_girl_ho_se
              </h1>
            </Link>

            {/* RIGHT SIDE */}

            <div className="ml-auto flex items-center gap-1.5">

              {/* =================================
                  DESKTOP SEARCH
              ================================= */}

              <div
                ref={searchRef}
                className="relative hidden lg:flex"
              >

                <Search
                  className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(
                      e.target.value
                    );

                    setSearchOpen(
                      e.target.value.trim()
                        .length > 0
                    );
                  }}
                  onFocus={() => {
                    if (
                      search.trim()
                    ) {
                      setSearchOpen(
                        true
                      );
                    }
                  }}
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search jewellery..."
                  aria-label="Search jewellery"
                  className="w-56 rounded-full border border-[#E6DDD6] bg-[#FBFAF8] py-2 pl-9 pr-10 text-sm outline-none transition focus:border-[#C98F7B]"
                />

                {/* SEARCH BUTTON */}

                <button
                  type="button"
                  onClick={
                    handleSearch
                  }
                  aria-label="Search"
                  className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#5A3542] text-white transition hover:bg-[#432630]"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>

                {/* =================================
                    SEARCH POPUP
                ================================= */}

                {searchOpen && (
                  <div className="absolute left-0 top-12 z-[100] w-[390px] overflow-hidden rounded-2xl border border-[#E7DED8] bg-white shadow-[0_20px_50px_rgba(50,30,20,0.15)]">

                    {/* POPUP HEADER */}

                    <div className="border-b border-[#F0E8E3] px-5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A78C82]">
                        Search Results
                      </p>

                      <p className="mt-1 text-sm text-[#4A403D]">
                        Results for{" "}
                        <span className="font-semibold text-[#5A3542]">
                          "{search}"
                        </span>
                      </p>
                    </div>

                    {/* LOADING */}

                    {searchLoading && (
                      <div className="px-5 py-6 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    )}

                    {!searchLoading &&
                      searchTerm &&
                      matchingCollections.length ===
                        0 &&
                      matchingProducts.length ===
                        0 && (
                        <div className="px-5 py-8 text-center">
                          <div className="text-2xl">
                            🔍
                          </div>

                          <p className="mt-2 text-sm font-semibold text-[#3A302D]">
                            No results found
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Try another jewellery
                            name or collection.
                          </p>
                        </div>
                      )}

                    {/* COLLECTIONS */}

                    {!searchLoading &&
                      matchingCollections.length >
                        0 && (
                        <div className="border-b border-[#F0E8E3] px-5 py-4">

                          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A78C82]">
                            Collections
                          </p>

                          <div className="space-y-1">

                            {matchingCollections.map(
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
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FAF5F2]"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F0EC] text-sm">
                                    {
                                      collection.icon
                                    }
                                  </span>

                                  <span className="text-sm font-medium text-[#3A302D]">
                                    {
                                      collection.name
                                    }
                                  </span>

                                  <ArrowRight
                                    size={14}
                                    className="ml-auto text-[#B99A8E]"
                                  />
                                </button>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    {/* PRODUCTS */}

                    {!searchLoading &&
                      matchingProducts.length >
                        0 && (
                        <div className="px-5 py-4">

                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A78C82]">
                              Products
                            </p>

                            <span className="text-[10px] text-gray-400">
                              {matchingProducts.length}{" "}
                              found
                            </span>
                          </div>

                          <div className="space-y-2">

                            {matchingProducts.map(
                              (
                                product
                              ) => {
                                const image =
                                  product.image ||
                                  product.images?.[0] ||
                                  "/placeholder-product.jpg";

                                return (
                                  <button
                                    key={
                                      product._id
                                    }
                                    type="button"
                                    onClick={() =>
                                      handleProductClick(
                                        product._id
                                      )
                                    }
                                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#FAF5F2]"
                                  >

                                    {/* IMAGE */}

                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F8F4F1]">
                                      <img
                                        src={image}
                                        alt={
                                          product.name
                                        }
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    {/* DETAILS */}

                                    <div className="min-w-0 flex-1">

                                      <p className="truncate text-sm font-semibold text-[#3A302D]">
                                        {
                                          product.name
                                        }
                                      </p>

                                      <p className="mt-0.5 text-[11px] text-gray-500">
                                        {
                                          product.category
                                        }
                                      </p>

                                      {product.price !==
                                        undefined && (
                                        <p className="mt-1 text-xs font-semibold text-[#8D4E67]">
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
                                      className="shrink-0 text-[#B99A8E]"
                                    />

                                  </button>
                                );
                              }
                            )}

                          </div>

                        </div>
                      )}

                    {/* VIEW ALL */}

                    {!searchLoading &&
                      searchTerm && (
                        <button
                          type="button"
                          onClick={
                            handleSearch
                          }
                          className="flex w-full items-center justify-center gap-2 border-t border-[#F0E8E3] bg-[#FAF7F4] px-5 py-3.5 text-xs font-bold text-[#5A3542] transition hover:bg-[#F5ECE7]"
                        >
                          View all results
                          <ArrowRight
                            size={14}
                          />
                        </button>
                      )}

                  </div>
                )}

              </div>

              {/* ACCOUNT */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setAccountOpen(
                      !accountOpen
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
                  aria-label="Account"
                >
                  <User className="h-4 w-4 text-[#444]" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

                    {!user ? (
                      <>
                        <Link
                          href="/login"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="block px-5 py-3 text-[#2E2E2E] transition hover:bg-[#F8F8F8]"
                        >
                          Login
                        </Link>

                        <Link
                          href="/register"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="block px-5 py-3 text-[#2E2E2E] transition hover:bg-[#F8F8F8]"
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="border-b px-5 py-4">
                          <p className="font-semibold text-[#333]">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/account/profile"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="block px-5 py-3 hover:bg-[#F8F8F8]"
                        >
                          My Profile
                        </Link>

                        <Link
                          href="/account/orders"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="block px-5 py-3 hover:bg-[#F8F8F8]"
                        >
                          My Orders
                        </Link>

                        <Link
                          href="/wishlist"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="block px-5 py-3 hover:bg-[#F8F8F8]"
                        >
                          Wishlist
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountOpen(
                              false
                            );
                          }}
                          className="w-full border-t px-5 py-3 text-left text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    )}

                  </div>
                )}

              </div>

              {/* WISHLIST */}

              <Link
                href="/wishlist"
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4 text-[#444]" />

                {wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B86A6A] text-[9px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <button
                type="button"
                onClick={openCart}
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4 text-[#444]" />

                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B86A6A] text-[9px] text-white">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>

        {/* =====================================
            DESKTOP NAVIGATION
        ====================================== */}

        <nav className="hidden border-t border-[#F0E8E3] lg:block">

          <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4">

            <div className="flex items-center justify-center gap-8">

              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[#353535] transition hover:text-[#A86C58]"
                >
                  {item.name}
                </Link>
              ))}

            </div>

          </div>

        </nav>

        {/* =====================================
            MOBILE MENU
        ====================================== */}

        {mobileOpen && (
          <div className="border-t bg-white lg:hidden">

            <nav className="flex flex-col">

              {/* MOBILE SEARCH */}

              <div className="border-b px-6 py-4">

                <div
                  ref={searchRef}
                  className="relative"
                >

                  <Search
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(
                        e.target.value
                      );

                      setSearchOpen(
                        e.target.value.trim()
                          .length > 0
                      );
                    }}
                    onKeyDown={
                      handleSearchKeyDown
                    }
                    placeholder="Search jewellery..."
                    aria-label="Search jewellery"
                    className="w-full rounded-full border border-[#E6DDD6] bg-[#FBFAF8] py-3 pl-11 pr-12 text-sm outline-none focus:border-[#C98F7B]"
                  />

                  <button
                    type="button"
                    onClick={
                      handleSearch
                    }
                    aria-label="Search"
                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#5A3542] text-white"
                  >
                    <Search className="h-4 w-4" />
                  </button>

                  {/* MOBILE SEARCH RESULTS */}

                  {searchOpen && (
                    <div className="absolute left-0 right-0 top-14 z-[100] max-h-[70vh] overflow-y-auto rounded-2xl border border-[#E7DED8] bg-white shadow-2xl">

                      {matchingCollections.length >
                        0 && (
                        <div className="border-b border-[#F0E8E3] p-4">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A78C82]">
                            Collections
                          </p>

                          {matchingCollections.map(
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
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#FAF5F2]"
                              >
                                <span>
                                  {
                                    collection.icon
                                  }
                                </span>

                                <span className="text-sm font-medium">
                                  {
                                    collection.name
                                  }
                                </span>
                              </button>
                            )
                          )}

                        </div>
                      )}

                      {matchingProducts.length >
                        0 && (
                        <div className="p-4">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A78C82]">
                            Products
                          </p>

                          {matchingProducts.map(
                            (
                              product
                            ) => (
                              <button
                                key={
                                  product._id
                                }
                                type="button"
                                onClick={() =>
                                  handleProductClick(
                                    product._id
                                  )
                                }
                                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#FAF5F2]"
                              >

                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F8F4F1]">
                                  <img
                                    src={
                                      product.image ||
                                      product.images?.[0] ||
                                      "/placeholder-product.jpg"
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-sm font-semibold">
                                    {
                                      product.name
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {
                                      product.category
                                    }
                                  </p>

                                </div>

                              </button>
                            )
                          )}

                        </div>
                      )}

                      {!searchLoading &&
                        searchTerm &&
                        matchingCollections.length ===
                          0 &&
                        matchingProducts.length ===
                          0 && (
                          <div className="p-7 text-center">
                            <p className="text-sm font-semibold">
                              No results found
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Try another search.
                            </p>
                          </div>
                        )}

                      {searchTerm && (
                        <button
                          type="button"
                          onClick={
                            handleSearch
                          }
                          className="w-full border-t bg-[#FAF7F4] px-4 py-3 text-xs font-bold text-[#5A3542]"
                        >
                          View all results →
                        </button>
                      )}

                    </div>
                  )}

                </div>

              </div>

              {/* NAV LINKS */}

              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="border-b px-6 py-4 text-[#444] hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))}

              {/* ACCOUNT */}

              <div className="border-t px-6 py-5">

                {!user ? (
                  <div className="space-y-3">

                    <Link
                      href="/login"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="block rounded-full bg-[#A86C58] py-3 text-center text-white"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="block rounded-full border border-[#A86C58] py-3 text-center text-[#A86C58]"
                    >
                      Register
                    </Link>

                  </div>
                ) : (
                  <div className="space-y-3">

                    <p className="font-semibold">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>

                    <Link
                      href="/profile"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="block"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="block"
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="text-red-600"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>

            </nav>

          </div>
        )}

      </header>

      <CartDrawer />
    </>
  );
}