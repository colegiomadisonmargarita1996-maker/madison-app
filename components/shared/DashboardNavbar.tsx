"use client";

import { Button } from "@/components/ui/Button";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardNavbarProps {
  userName: string;
  onMenuClick?: () => void;
}

export function DashboardNavbar({ userName, onMenuClick }: DashboardNavbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al logout:", error);
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4 flex justify-between items-center gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-600 hover:text-gray-900 text-xl leading-none px-1"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="w-10 h-10 bg-azul-oscuro rounded-full text-white flex items-center justify-center font-bold shrink-0">
            M
          </div>
          <span className="text-lg font-bold text-azul-oscuro">Madison</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-gray-600 truncate">
            Bienvenido, {userName}
          </span>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            {loading ? "Saliendo..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
