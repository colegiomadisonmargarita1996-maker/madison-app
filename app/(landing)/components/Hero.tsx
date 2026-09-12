"use client";

import { Button } from "@/components/ui/Button";

export function Hero() {
  const handleScroll = () => {
    document.getElementById("quienes-somos")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-8 border-azul-oscuro rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-8 border-azul-cielo rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-8 border-blue-300 rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Educación potenciada por{" "}
          <span className="text-azul-cielo">IA</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma integral para colegios modernos. Automatiza procesos,
          mejora comunicación y crece sin límites.
        </p>
        <Button onClick={handleScroll} variant="primary" size="lg" className="mb-4">
          Conocer más
        </Button>
      </div>
    </section>
  );
}
