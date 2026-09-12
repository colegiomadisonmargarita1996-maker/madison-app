"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import type { Rol } from "@/types";

export function DashboardShell({
  userName,
  rol,
  children,
}: {
  userName: string;
  rol: Rol;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform md:static md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar rol={rol} onNavigate={() => setMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar userName={userName} onMenuClick={() => setMenuOpen((v) => !v)} />
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
