"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Estudiante, Pago } from "@/types";

interface Fila {
  estudiante: Estudiante;
  pago: Pago | null;
}

export function GestionarPagosForm({ filas }: { filas: Fila[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEstadoChange = async (
    estudianteId: string,
    nuevoEstado: "pagado" | "moroso",
    monto: number | null
  ) => {
    setLoadingId(estudianteId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estudiante_id: estudianteId,
          estado: nuevoEstado,
          monto: monto ?? undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar");
      }

      setSuccess("Pago actualizado");
      router.refresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">✓ {success}</div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">✕ {error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-2 font-bold">Estudiante</th>
              <th className="text-left py-2 font-bold">Grado</th>
              <th className="text-center py-2 font-bold">Monto</th>
              <th className="text-center py-2 font-bold">Estado Actual</th>
              <th className="text-center py-2 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(({ estudiante, pago }) => {
              const estado = pago?.estado ?? "pagado";
              const loading = loadingId === estudiante.id;

              return (
                <tr key={estudiante.id} className="border-b border-gray-200">
                  <td className="py-3">{estudiante.nombre}</td>
                  <td>
                    {estudiante.grado}
                    {estudiante.seccion ? ` - ${estudiante.seccion}` : ""}
                  </td>
                  <td className="text-center">
                    {pago?.monto != null ? `$${pago.monto}` : "-"}
                  </td>
                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        estado === "pagado"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {estado === "pagado" ? "✓ Pagado" : "✕ Moroso"}
                    </span>
                  </td>
                  <td className="text-center">
                    {estado === "moroso" ? (
                      <Button
                        onClick={() =>
                          handleEstadoChange(estudiante.id, "pagado", pago?.monto ?? null)
                        }
                        variant="primary"
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? "..." : "Marcar Pagado"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleEstadoChange(estudiante.id, "moroso", pago?.monto ?? null)
                        }
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? "..." : "Marcar Moroso"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
