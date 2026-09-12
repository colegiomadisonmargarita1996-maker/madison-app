"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-azul-oscuro rounded-full flex items-center justify-center text-white font-display font-bold text-sm">
            M
          </div>
          <span className="font-display text-lg font-semibold text-ink">
            Madison
          </span>
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
