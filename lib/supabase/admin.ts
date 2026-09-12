import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — bypassa RLS. Solo para uso server-side en
 * endpoints donde no hay sesión de usuario (ej. formulario publico de
 * contacto) y los datos ya fueron validados antes de llegar aqui.
 * Nunca importar desde codigo que se ejecute en el cliente.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
