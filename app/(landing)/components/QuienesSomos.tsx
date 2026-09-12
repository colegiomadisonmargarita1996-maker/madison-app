export function QuienesSomos() {
  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Quiénes Somos
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Misión</h3>
            <p className="text-gray-600">
              Proporcionar educación de excelencia potenciada por tecnología e
              IA para formar ciudadanos innovadores.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visión</h3>
            <p className="text-gray-600">
              Ser la institución educativa líder en innovación tecnológica y
              formación integral en la región.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Valores</h3>
            <p className="text-gray-600">
              Excelencia, innovación, integridad y compromiso con el
              desarrollo integral de nuestros estudiantes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
