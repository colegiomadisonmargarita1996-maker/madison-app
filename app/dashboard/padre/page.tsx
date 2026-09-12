import { createClient } from "@/lib/supabase/server";
import {
  getEstudianteByPadre,
  getCalificacionesByEstudiante,
  getUltimoPago,
} from "@/lib/db";
import { Card } from "@/components/ui/Card";

export default async function PadreDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const estudiante = await getEstudianteByPadre(supabase, user!.id);
  if (!estudiante) return null;

  const [calificaciones, pago] = await Promise.all([
    getCalificacionesByEstudiante(supabase, estudiante.id),
    getUltimoPago(supabase, estudiante.id),
  ]);

  const notas = calificaciones
    .map((c) => c.nota)
    .filter((n): n is number => n !== null);
  const promedio =
    notas.length > 0
      ? (notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(1)
      : "-";

  const alDia = !pago || pago.estado === "pagado";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver el progreso académico de tu hijo
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Estado del Alumno</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-lg font-bold text-gray-900">{estudiante.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grado</p>
              <p className="text-lg font-bold text-gray-900">
                {estudiante.grado}
                {estudiante.seccion ? ` - ${estudiante.seccion}` : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-lg font-bold text-gray-900">{promedio} / 20</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className={`border-l-4 ${alDia ? "border-green-500" : "border-red-500"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Estado de Pagos</h3>
            <p className={alDia ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {alDia ? "✓ Al día" : "✕ Moroso"}
            </p>
          </div>
          <div className="text-4xl">{alDia ? "✓" : "✕"}</div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Últimas Calificaciones
        </h2>
        {calificaciones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2 font-bold">Materia</th>
                  <th className="text-center py-2 font-bold">Nota</th>
                  <th className="text-left py-2 font-bold">Trimestre</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.slice(0, 5).map((cal) => (
                  <tr key={cal.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3">{cal.materia}</td>
                    <td className="text-center font-semibold">{cal.nota ?? "-"}</td>
                    <td>{cal.trimestre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">Aún no hay calificaciones registradas</p>
        )}
      </Card>
    </div>
  );
}
