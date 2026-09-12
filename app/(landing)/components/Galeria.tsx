"use client";

import { useState } from "react";

const MOMENTOS = [
  { nombre: "Feria de Ciencias", span: "md:col-span-2 md:row-span-2" },
  { nombre: "Laboratorio de Robótica", span: "" },
  { nombre: "Acto Cívico", span: "" },
  { nombre: "Educación Física", span: "" },
  { nombre: "Biblioteca", span: "md:col-span-2" },
  { nombre: "Excursión Escolar", span: "" },
];

export function Galeria() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-24 bg-arena">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-ink mb-12">
          La vida en el colegio
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9rem] gap-3">
          {MOMENTOS.map((m) => (
            <button
              key={m.nombre}
              onClick={() => setSelected(m.nombre)}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-azul-oscuro to-azul-cielo text-left ${m.span}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-3 left-4 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {m.nombre}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="relative max-w-lg w-full">
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-10 right-0 text-white text-2xl"
                aria-label="Cerrar"
              >
                ✕
              </button>
              <div className="bg-gradient-to-br from-azul-oscuro to-azul-cielo w-full h-72 rounded-xl flex items-end p-6">
                <span className="text-white font-display font-semibold text-xl">
                  {selected}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
