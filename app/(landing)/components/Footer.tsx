import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10 text-left">
          <div>
            <h4 className="font-display font-semibold mb-4">Contacto</h4>
            <p className="text-white/60">Margarita, Venezuela</p>
            <p className="text-white/60">+58-XXX-XXXXXXX</p>
            <p className="text-white/60">info@colegiomadison.edu.ve</p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Síguenos</h4>
            <div className="flex flex-col gap-2">
              <a href="https://instagram.com" className="text-white/60 hover:text-mango transition-colors">
                Instagram
              </a>
              <a href="https://facebook.com" className="text-white/60 hover:text-mango transition-colors">
                Facebook
              </a>
              <a href="https://wa.me/58XXXXXXXXX" className="text-white/60 hover:text-mango transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Enlaces</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-white/60 hover:text-mango transition-colors">
                Inicio
              </Link>
              <Link href="/login" className="text-white/60 hover:text-mango transition-colors">
                Portal
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-white/60 hover:text-mango transition-colors text-sm">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-white/40 text-sm">
          <p>© 2026 Colegio Madison. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
