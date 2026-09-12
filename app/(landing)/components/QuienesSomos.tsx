import { RevealSection, StaggerChildren } from "@/components/shared/Reveal";

const PILARES = [
  {
    titulo: "Misión",
    texto:
      "Proporcionar educación de excelencia potenciada por tecnología e IA para formar ciudadanos innovadores.",
  },
  {
    titulo: "Visión",
    texto:
      "Ser la institución educativa líder en innovación tecnológica y formación integral en la región.",
  },
  {
    titulo: "Valores",
    texto:
      "Excelencia, innovación, integridad y compromiso con el desarrollo integral de nuestros estudiantes.",
  },
];

export function QuienesSomos() {
  return (
    <section id="quienes-somos" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20">
        <RevealSection>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-ink text-balance">
            Quiénes somos
          </h2>
          <p className="mt-4 text-ink/60 max-w-xs">
            Un colegio en Margarita construyendo, día a día, la educación que
            queremos para nuestros estudiantes.
          </p>
        </RevealSection>

        <StaggerChildren className="divide-y divide-ink/10 border-t border-ink/10">
          {PILARES.map((p) => (
            <div key={p.titulo} className="py-7 grid sm:grid-cols-[8rem_1fr] gap-2 sm:gap-8">
              <h3 className="font-display font-semibold text-xl text-azul-oscuro">
                {p.titulo}
              </h3>
              <p className="text-ink/70 leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
