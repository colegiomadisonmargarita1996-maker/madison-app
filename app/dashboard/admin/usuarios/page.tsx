import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { CrearUsuarioForm } from "./CrearUsuarioForm";

const ROL_LABEL: Record<string, string> = {
  admin: "Admin",
  profesor: "Profesor",
  padre: "Padre",
  alumno: "Alumno",
};

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
          Crea y consulta las cuentas de padres, profesores y administradores
        </p>
      </div>

      <CrearUsuarioForm />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-2 font-bold">Nombre</th>
                <th className="text-left py-2 font-bold">Email</th>
                <th className="text-left py-2 font-bold">Rol</th>
                <th className="text-center py-2 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(usuarios ?? []).map((u) => (
                <tr key={u.id} className="border-b border-gray-200">
                  <td className="py-3">{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{ROL_LABEL[u.rol] ?? u.rol}</td>
                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
