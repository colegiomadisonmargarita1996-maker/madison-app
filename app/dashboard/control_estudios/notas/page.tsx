import { createClient } from "@/lib/supabase/server";
import { getCalificacionesByGradoYTrimestre } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { GradoTrimestreSelector } from "./GradoTrimestreSelector";
import { EditarCalificacionesForm } from "./EditarCalificacionesForm";

export default async function ControlEstudiosNotasPage({
  searchParams,
}: {
  searchParams: Promise<{ grado?: string; trimestre?: string }>;
}) {
  const { grado = "1ro", trimestre = "Trimestre I" } = await searchParams;

  const supabase = await createClient();
  const datos = await getCalificacionesByGradoYTrimestre(supabase, grado, trimestre);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notas por Grado</h1>
        <p className="text-gray-600 mt-2">
          Consulta y corrige las calificaciones cargadas por los profesores
        </p>
      </div>

      <Card>
        <GradoTrimestreSelector grado={grado} trimestre={trimestre} />
      </Card>

      <EditarCalificacionesForm datos={datos} trimestre={trimestre} />
    </div>
  );
}
