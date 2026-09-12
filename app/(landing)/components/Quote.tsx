import { RevealSection } from "@/components/shared/Reveal";

export function Quote() {
  return (
    <section className="py-24 bg-azul-oscuro text-white">
      <RevealSection className="max-w-4xl mx-auto px-6">
        <span className="font-display text-7xl md:text-8xl text-mango leading-none">
          &ldquo;
        </span>
        <p className="font-display font-semibold text-2xl md:text-4xl leading-snug -mt-4 text-balance">
          La educación es el arma más poderosa para cambiar el mundo.
        </p>
        <p className="mt-6 text-white/60">— Dirección, Colegio Madison</p>
      </RevealSection>
    </section>
  );
}
