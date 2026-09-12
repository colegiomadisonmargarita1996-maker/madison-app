"use client";

import { useRouter, usePathname } from "next/navigation";

const TRIMESTRES = ["Trimestre I", "Trimestre II", "Trimestre III"];

export function TrimestreSelector({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={value}
      onChange={(e) => router.push(`${pathname}?trimestre=${e.target.value}`)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
    >
      {TRIMESTRES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
