import { createClient } from "@/lib/supabase/server";
import { getEstudiantesByGrado } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { GradoSelector } from "@/components/shared/GradoSelector";
import { CargarNotasForm } from "./CargarNotasForm";

export default async function CargarNotasPage({
  searchParams,
}: {
  searchParams: Promise<{ grado?: string }>;
}) {
  const { grado = "1ro" } = await searchParams;

  const supabase = await createClient();
  const estudiantes = await getEstudiantesByGrado(supabase, grado);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cargar Notas</h1>
        <p className="text-gray-600 mt-2">
          Ingresa calificaciones para tus estudiantes
        </p>
      </div>

      <Card>
        <label className="text-sm font-medium text-gray-700">Grado</label>
        <GradoSelector value={grado} />
      </Card>

      <CargarNotasForm estudiantes={estudiantes} />
    </div>
  );
}
