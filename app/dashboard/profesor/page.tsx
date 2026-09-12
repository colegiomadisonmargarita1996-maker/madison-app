import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function ProfesorDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: totalEstudiantes }, { data: misCalificaciones }] =
    await Promise.all([
      supabase.from("estudiantes").select("id", { count: "exact", head: true }),
      supabase
        .from("calificaciones")
        .select("materia")
        .eq("profesor_id", user!.id),
    ]);

  const materias = new Set((misCalificaciones ?? []).map((c) => c.materia));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
        <p className="text-gray-600 mt-2">
          Gestiona calificaciones de tus estudiantes
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Estudiantes</p>
            <p className="text-3xl font-bold text-azul-oscuro">
              {totalEstudiantes ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Materias que dictas</p>
            <p className="text-3xl font-bold text-azul-oscuro">{materias.size}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Calificaciones cargadas</p>
            <p className="text-3xl font-bold text-azul-oscuro">
              {misCalificaciones?.length ?? 0}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/profesor/notas"
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
          >
            <p className="font-bold text-azul-oscuro">✍️ Cargar Notas</p>
            <p className="text-sm text-gray-600">Ingresa calificaciones</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
