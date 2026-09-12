import { createClient } from "@/lib/supabase/server";
import { getEstudianteByPadre, getCalificacionesByEstudiante } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { TrimestreSelector } from "@/components/shared/TrimestreSelector";

export default async function CalificacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ trimestre?: string }>;
}) {
  const { trimestre = "Trimestre I" } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const estudiante = await getEstudianteByPadre(supabase, user!.id);
  if (!estudiante) return null;

  const calificaciones = await getCalificacionesByEstudiante(
    supabase,
    estudiante.id,
    trimestre
  );

  const notas = calificaciones
    .map((c) => c.nota)
    .filter((n): n is number => n !== null);
  const promedio =
    notas.length > 0
      ? (notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(2)
      : "0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calificaciones</h1>
        <p className="text-gray-600 mt-2">Progreso académico de tu hijo</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-900">Trimestre:</label>
          <TrimestreSelector value={trimestre} />
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-azul-oscuro to-azul-cielo text-white">
        <div>
          <p className="text-blue-100">Promedio {trimestre}</p>
          <p className="text-4xl font-bold">{promedio} / 20</p>
        </div>
      </Card>

      <Card>
        {calificaciones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2 font-bold">Materia</th>
                  <th className="text-center py-2 font-bold">Nota</th>
                  <th className="text-left py-2 font-bold">Profesor</th>
                  <th className="text-left py-2 font-bold">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((cal) => (
                  <tr key={cal.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3">{cal.materia}</td>
                    <td className="text-center font-semibold text-azul-oscuro">
                      {cal.nota ?? "-"}
                    </td>
                    <td className="text-gray-600">
                      {(cal.profesor as unknown as { nombre: string } | null)?.nombre ?? "N/A"}
                    </td>
                    <td className="text-gray-600 text-xs">{cal.comentario || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No hay calificaciones para este trimestre
          </p>
        )}
      </Card>
    </div>
  );
}
