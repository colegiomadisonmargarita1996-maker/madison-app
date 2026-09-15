"use client";

import { useRouter, usePathname } from "next/navigation";

const GRADOS = ["1ro", "2do", "3ro"];
const TRIMESTRES = ["Trimestre I", "Trimestre II", "Trimestre III"];

export function GradoTrimestreSelector({
  grado,
  trimestre,
}: {
  grado: string;
  trimestre: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const irA = (nuevoGrado: string, nuevoTrimestre: string) => {
    router.push(`${pathname}?grado=${nuevoGrado}&trimestre=${encodeURIComponent(nuevoTrimestre)}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Grado</label>
        <select
          value={grado}
          onChange={(e) => irA(e.target.value, trimestre)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
        >
          {GRADOS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Trimestre</label>
        <select
          value={trimestre}
          onChange={(e) => irA(grado, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
        >
          {TRIMESTRES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
