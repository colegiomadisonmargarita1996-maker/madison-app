"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Rol } from "@/types";

interface SidebarProps {
  rol: Rol;
}

const menuItems: Record<Rol, { href: string; label: string; icon: string }[]> = {
  padre: [
    { href: "/dashboard/padre", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/padre/calificaciones", label: "Calificaciones", icon: "📝" },
  ],
  profesor: [
    { href: "/dashboard/profesor", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/profesor/notas", label: "Cargar Notas", icon: "✍️" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/admin/pagos", label: "Pagos", icon: "💰" },
  ],
  alumno: [{ href: "/dashboard/alumno", label: "Dashboard", icon: "📊" }],
};

export function Sidebar({ rol }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[rol] ?? [];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 shrink-0">
      <nav className="p-6 space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href ? "bg-azul-oscuro" : "hover:bg-gray-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
