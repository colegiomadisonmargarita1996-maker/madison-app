export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Política de Privacidad
      </h1>
      <div className="prose text-gray-700 space-y-4">
        <p>
          En Colegio Madison protegemos los datos personales de nuestros
          estudiantes, padres y visitantes conforme a la Ley de Protección de
          Datos Personales de Venezuela (LPDP).
        </p>
        <p>
          Los datos que recopilamos a través de nuestros formularios (nombre,
          correo electrónico, teléfono, grado de interés y mensaje) se
          utilizan exclusivamente para gestionar solicitudes de información e
          inscripción, y no se comparten con terceros sin tu consentimiento
          explícito.
        </p>
        <p>
          Tienes derecho a solicitar acceso, rectificación o eliminación de
          tus datos personales en cualquier momento escribiendo a{" "}
          <a href="mailto:info@colegiomadison.edu.ve" className="text-azul-cielo underline">
            info@colegiomadison.edu.ve
          </a>
          .
        </p>
      </div>
    </main>
  );
}
