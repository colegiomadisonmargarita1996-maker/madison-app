import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <p className="text-gray-400">📍 Margarita, Venezuela</p>
            <p className="text-gray-400">📞 +58-XXX-XXXXXXX</p>
            <p className="text-gray-400">✉️ info@colegiomadison.edu.ve</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex flex-col gap-2">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                Instagram
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="https://wa.me/58XXXXXXXXX" className="text-gray-400 hover:text-white">
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-400 hover:text-white">
                Inicio
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white">
                Portal
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© 2026 Colegio Madison. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
