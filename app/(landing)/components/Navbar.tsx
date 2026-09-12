"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-icon.png"
            alt="Colegio Madison"
            width={144}
            height={83}
            priority
            className="h-9 w-auto"
          />
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
