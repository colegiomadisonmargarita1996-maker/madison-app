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

export async function getEstudiantesByGrado(
  supabase: SupabaseClient,
  grado: string
) {
  const { data, error } = await supabase
    .from("estudiantes")
    .select("*")
    .eq("grado", grado)
    .order("nombre");

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

export async function getEstudiantesConEstadoPago(supabase: SupabaseClient) {
  const [{ data: estudiantes, error: errEst }, { data: pagos, error: errPagos }] =
    await Promise.all([
      supabase.from("estudiantes").select("*").order("nombre"),
      supabase.from("pagos").select("*").order("created_at", { ascending: false }),
    ]);

  if (errEst) throw errEst;
  if (errPagos) throw errPagos;

  const ultimoPagoPorEstudiante = new Map<string, (typeof pagos)[number]>();
  for (const pago of pagos ?? []) {
    if (!ultimoPagoPorEstudiante.has(pago.estudiante_id)) {
      ultimoPagoPorEstudiante.set(pago.estudiante_id, pago);
    }
  }

  return (estudiantes ?? []).map((estudiante) => ({
    estudiante,
    pago: ultimoPagoPorEstudiante.get(estudiante.id) ?? null,
  }));
}
