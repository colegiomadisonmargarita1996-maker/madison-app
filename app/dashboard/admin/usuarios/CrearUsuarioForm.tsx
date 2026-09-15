"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialForm = { nombre: "", email: "", rol: "padre" };

export function CrearUsuarioForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creado, setCreado] = useState<{ email: string; passwordTemporal: string } | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreado(null);

    try {
      const response = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }

      setCreado({ email: formData.email, passwordTemporal: data.passwordTemporal });
      setFormData(initialForm);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const copiarPassword = () => {
    if (creado) navigator.clipboard.writeText(creado.passwordTemporal);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Crear usuario</h2>

      {creado && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Usuario creado: {creado.email}
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Contraseña temporal (compártela por WhatsApp o en persona — no
            volverá a mostrarse):
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm">
              {creado.passwordTemporal}
            </code>
            <Button type="button" variant="secondary" size="sm" onClick={copiarPassword}>
              Copiar
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">✕ {error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 items-end">
        <Input
          label="Nombre completo"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
          >
            <option value="padre">Padre</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creando..." : "Crear usuario"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
