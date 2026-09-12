import { createClient } from "@/lib/supabase/server";
import { getEstudiantesConEstadoPago } from "@/lib/db";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const filas = await getEstudiantesConEstadoPago(supabase);

  const totalEstudiantes = filas.length;
  const morosos = filas.filter((f) => f.pago?.estado === "moroso").length;
  const alDia = totalEstudiantes - morosos;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-600 mt-2">Gestiona pagos y usuarios</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div>
            <p className="text-sm text-gray-600">Total Estudiantes</p>
            <p className="text-4xl font-bold text-azul-oscuro">{totalEstudiantes}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div>
            <p className="text-sm text-gray-600">Al Día</p>
            <p className="text-4xl font-bold text-green-600">{alDia}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div>
            <p className="text-sm text-gray-600">Morosos</p>
            <p className="text-4xl font-bold text-red-600">{morosos}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/admin/pagos"
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            <p className="font-bold text-gray-900">💰 Gestionar Pagos</p>
            <p className="text-sm text-gray-600">Actualizar estado de pagos</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
