"use client";

import { Button } from "@/components/ui/Button";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardNavbarProps {
  userName: string;
}

export function DashboardNavbar({ userName }: DashboardNavbarProps) {
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
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-azul-oscuro rounded-full text-white flex items-center justify-center font-bold">
            M
          </div>
          <span className="text-lg font-bold text-azul-oscuro">Madison</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Bienvenido, {userName}</span>
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
