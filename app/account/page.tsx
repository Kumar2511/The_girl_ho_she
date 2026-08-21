"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    {
      title: "My Orders",
      description: "View all your orders",
      href: "/account/orders",
      icon: "📦",
    },
    {
      title: "My Addresses",
      description: "Manage delivery addresses",
      href: "/account/addresses",
      icon: "📍",
    },
    {
      title: "Edit Profile",
      description: "Update your profile",
      href: "/account/profile",
      icon: "👤",
    },
    {
      title: "Change Password & Delete Your Account",
      description: "Update your password",
      href: "/account/security",
      icon: "🔒",
    },  
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-10 px-4">

        <div className="max-w-6xl mx-auto">

          {/* Header */}

          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">

            <h1 className="text-4xl font-bold text-[#2E2E2E]">
              My Account
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              Welcome,
              <span className="font-semibold text-[#C78B7B]">
                {" "}
                {user?.name}
              </span>
            </p>

            <p className="text-gray-500 mt-1">
              {user?.email}
            </p>

          </div>

          {/* Menu */}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white rounded-2xl shadow-md border border-[#E8E3DC] p-6 hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="text-5xl mb-4">
                  {item.icon}
                </div>

                <h2 className="text-xl font-bold text-[#2E2E2E]">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.description}
                </p>
              </Link>
            ))}

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="bg-red-50 border border-red-200 rounded-2xl shadow-md p-6 text-left hover:bg-red-100 transition"
            >
              <div className="text-5xl mb-4">
                🚪
              </div>

              <h2 className="text-xl font-bold text-red-600">
                Logout
              </h2>

              <p className="text-red-500 mt-2">
                Sign out from your account
              </p>
            </button>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}