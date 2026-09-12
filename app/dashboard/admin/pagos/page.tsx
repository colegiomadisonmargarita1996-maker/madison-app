import { createClient } from "@/lib/supabase/server";
import { getEstudiantesConEstadoPago } from "@/lib/db";
import { GestionarPagosForm } from "./GestionarPagosForm";

export default async function GestionarPagosPage() {
  const supabase = await createClient();
  const filas = await getEstudiantesConEstadoPago(supabase);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Pagos</h1>
        <p className="text-gray-600 mt-2">
          Actualiza estado de pagos de estudiantes
        </p>
      </div>

      <GestionarPagosForm filas={filas} />
    </div>
  );
}
