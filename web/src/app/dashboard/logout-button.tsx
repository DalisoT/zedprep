"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
      aria-label="Log out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
