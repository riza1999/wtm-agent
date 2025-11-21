"use client";

import { api } from "@/lib/api";
import { delay } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after short delay
    const timer = setTimeout(async () => {
      await api("/api/auth/logout", {
        method: "POST",
      });

      await delay(100);

      router.push("/login");
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg text-gray-600">Logging out...</p>
    </div>
  );
};

export default LogoutPage;
