import { createClient } from "@/lib/supabase/server";
import { getEstudianteByPadre, getUltimoPago } from "@/lib/db";
import { requireRole } from "@/lib/roleGuard";

export default async function PadreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole(["padre"]);
  const supabase = await createClient();

  const estudiante = await getEstudianteByPadre(supabase, user.id);

  if (!estudiante) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Aún no tienes un estudiante asociado a tu cuenta.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Contacta a administración: info@colegiomadison.edu.ve
        </p>
      </div>
    );
  }

  const pago = await getUltimoPago(supabase, estudiante.id);
  const isMoroso = pago?.estado === "moroso";

  return (
    <>
      {isMoroso && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
          ⚠️ Tu cuenta está en mora. Por favor, actualiza tu estado de pagos.
          Acceso a calificaciones restringido.
        </div>
      )}
      {isMoroso ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Acceso restringido por mora en pagos.
          </p>
          <p className="text-sm text-gray-500">
            Contacta a administración: info@colegiomadison.edu.ve
          </p>
        </div>
      ) : (
        children
      )}
    </>
  );
}
