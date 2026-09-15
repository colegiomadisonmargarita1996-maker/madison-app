import { createClient } from "@/lib/supabase/server";
import { CrearUsuarioForm } from "./CrearUsuarioForm";
import { UsuariosTable } from "./UsuariosTable";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: usuarios } = await supabase
    .from("users")
    .select("id, nombre, email, rol, estado, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 mt-2">
          Crea, edita y consulta las cuentas de padres, profesores y administradores
        </p>
      </div>

      <CrearUsuarioForm />

      <UsuariosTable usuarios={usuarios ?? []} />
    </div>
  );
}
