"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-azul-oscuro to-azul-cielo rounded-full flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold text-azul-oscuro">Madison</span>
        </Link>

        <Link href="/login">
          <Button variant="primary" size="md">
            Ingreso
          </Button>
        </Link>
      </div>
    </nav>
  );
}
