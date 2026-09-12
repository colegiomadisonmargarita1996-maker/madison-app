import type { SupabaseClient } from "@supabase/supabase-js";

export async function getEstudianteByPadre(
  supabase: SupabaseClient,
  padreId: string
) {
  const { data, error } = await supabase
    .from("estudiantes")
    .select("*")
    .eq("padre_id", padreId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCalificacionesByEstudiante(
  supabase: SupabaseClient,
  estudianteId: string,
  trimestre?: string
) {
  let query = supabase
    .from("calificaciones")
    .select("*, profesor:profesor_id(nombre)")
    .eq("estudiante_id", estudianteId)
    .order("created_at", { ascending: false });

  if (trimestre) {
    query = query.eq("trimestre", trimestre);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUltimoPago(
  supabase: SupabaseClient,
  estudianteId: string
) {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("estudiante_id", estudianteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
