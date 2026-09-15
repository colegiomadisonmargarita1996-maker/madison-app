"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ROL_LABEL: Record<string, string> = {
  admin: "Administrador de Sistema",
  administrativo: "Administrativo",
  control_estudios: "Control de Estudios",
  profesor: "Profesor",
  padre: "Padre",
};

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  created_at: string;
}

export function UsuariosTable({ usuarios }: { usuarios: Usuario[] }) {
  const [editando, setEditando] = useState<Usuario | null>(null);

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-2 font-bold">Nombre</th>
                <th className="text-left py-2 font-bold">Email</th>
                <th className="text-left py-2 font-bold">Rol</th>
                <th className="text-center py-2 font-bold">Estado</th>
                <th className="text-center py-2 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
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
                  <td className="text-center">
                    <Button variant="secondary" size="sm" onClick={() => setEditando(u)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editando && (
        <EditarUsuarioModal usuario={editando} onClose={() => setEditando(null)} />
      )}
    </>
  );
}

function EditarUsuarioModal({
  usuario,
  onClose,
}: {
  usuario: Usuario;
  onClose: () => void;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [rol, setRol] = useState(usuario.rol);
  const [estado, setEstado] = useState(usuario.estado);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/usuarios/${usuario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rol, estado }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/usuarios/${usuario.id}/reset-password`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al resetear contraseña");
      }

      const data = await response.json();
      setNuevaPassword(data.passwordTemporal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Editar usuario</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-4">
          <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
            >
              <option value="padre">Padre</option>
              <option value="profesor">Profesor</option>
              <option value="administrativo">Administrativo</option>
              <option value="control_estudios">Control de Estudios</option>
              <option value="admin">Administrador de Sistema</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          {nuevaPassword ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Nueva contraseña temporal (compártela por WhatsApp o en persona — no volverá a mostrarse):
              </p>
              <code className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm block">
                {nuevaPassword}
              </code>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleResetPassword} disabled={resetLoading}>
              {resetLoading ? "Generando..." : "Resetear contraseña"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
