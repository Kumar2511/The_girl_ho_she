"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem("redirect_after_login", currentPath);
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        router.replace("/login");
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C78B7B] border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-[#6B6B6B]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}