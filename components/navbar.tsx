"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[#EFE8E3] bg-white">

      {/* ================= TOP HEADER ================= */}

      <div className="mx-auto max-w-7xl px-4">
        <div className="relative flex h-14 items-center justify-between">

          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* ================= CENTER LOGO ================= */}

          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
          >
            <div className="text-sm leading-none text-pink-500">
              🌸
            </div>

            {/* Change brand name here */}
            <h1 className="font-serif text-[24px] leading-none text-[#5A3542]">
              The_girl_ho_se
            </h1>

           
          </Link>

          {/* ================= RIGHT SIDE ================= */}

          <div className="ml-auto flex items-center gap-1.5">

            {/* SEARCH */}

            <div className="relative hidden lg:flex">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jewellery..."
                className="w-48 rounded-full border border-[#E6DDD6] bg-[#FBFAF8] py-2 pl-9 pr-4 text-sm outline-none transition focus:border-[#C98F7B]"
              />
            </div>

            {/* ================= ACCOUNT ================= */}

            <div className="relative">

              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
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
      onClick={() => setAccountOpen(false)}
      className="block px-5 py-3 text-[#2E2E2E] transition hover:bg-[#F8F8F8]"
    >
      Login
    </Link>

    <Link
      href="/register"
      onClick={() => setAccountOpen(false)}
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
                        onClick={() => setAccountOpen(false)}
                        className="block px-5 py-3 hover:bg-[#F8F8F8]"
                      >
                        My Profile
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-5 py-3 hover:bg-[#F8F8F8]"
                      >
                        My Orders
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setAccountOpen(false)}
                        className="block px-5 py-3 hover:bg-[#F8F8F8]"
                      >
                        Wishlist
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
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

            {/* ================= WISHLIST ================= */}

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

            {/* ================= CART ================= */}

            <Link
              href="/cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4 text-[#444]" />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B86A6A] text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAVIGATION ================= */}

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

      {/* ================= MOBILE MENU ================= */}

      {mobileOpen && (
        <div className="border-t bg-white lg:hidden">

          <nav className="flex flex-col">

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-b px-6 py-4 text-[#444] hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t px-6 py-5">

              {!user ? (
                <div className="space-y-3">

                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-full bg-[#A86C58] py-3 text-center text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
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
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
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
  );
}