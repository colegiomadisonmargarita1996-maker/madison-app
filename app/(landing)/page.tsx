import { Hero } from "./components/Hero";
import { QuienesSomos } from "./components/QuienesSomos";
import { Galeria } from "./components/Galeria";
import { Quote } from "./components/Quote";
import { FormularioContacto } from "./components/FormularioContacto";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <QuienesSomos />
      <Galeria />
      <Quote />
      <FormularioContacto />
    </main>
  );
}
