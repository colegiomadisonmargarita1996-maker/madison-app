"use client";

import { useRouter, usePathname } from "next/navigation";

const GRADOS = ["1ro", "2do", "3ro"];

export function GradoSelector({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={value}
      onChange={(e) => router.push(`${pathname}?grado=${e.target.value}`)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
    >
      {GRADOS.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}
