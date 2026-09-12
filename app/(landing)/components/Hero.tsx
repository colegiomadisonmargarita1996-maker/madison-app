"use client";

import { Button } from "@/components/ui/Button";

const MATERIAS = [
  { nombre: "Matemáticas", nota: 18 },
  { nombre: "Ciencias Naturales", nota: 19 },
  { nombre: "Lengua y Literatura", nota: 17 },
];

export function Hero() {
  const handleScroll = () => {
    document.getElementById("quienes-somos")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-arena pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-ink text-balance">
            El boletín de tus hijos, siempre a la mano.
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-md">
            Colegio Madison reúne calificaciones, pagos y comunicación entre
            familia y profesores en un solo lugar — con inteligencia
            artificial que ayuda a cada estudiante a mejorar.
          </p>
          <div className="mt-9">
            <Button onClick={handleScroll} variant="accent" size="lg">
              Conocer más
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-azul-oscuro/5 -rotate-3" />
          <div className="relative bg-white rounded-2xl border border-ink/10 shadow-xl shadow-azul-oscuro/10 p-6 rotate-1">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
              <div>
                <p className="text-xs text-ink/50">Boletín · Trimestre I</p>
                <p className="font-display font-semibold text-ink">
                  Estudiante Madison
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-azul-oscuro text-white flex items-center justify-center font-display font-bold text-sm">
                M
              </div>
            </div>

            <div className="space-y-3">
              {MATERIAS.map((m) => (
                <div
                  key={m.nombre}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-ink/70">{m.nombre}</span>
                  <span className="font-display font-semibold text-azul-oscuro">
                    {m.nota}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between">
              <span className="text-sm text-ink/50">Promedio</span>
              <span className="font-display font-bold text-lg text-mango">
                18.0 / 20
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
