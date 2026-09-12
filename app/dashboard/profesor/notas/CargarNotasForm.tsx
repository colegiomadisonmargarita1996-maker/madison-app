"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Estudiante } from "@/types";

const TRIMESTRES = ["Trimestre I", "Trimestre II", "Trimestre III"];

interface FilaNota {
  nota: string;
  comentario: string;
}

export function CargarNotasForm({ estudiantes }: { estudiantes: Estudiante[] }) {
  const [trimestre, setTrimestre] = useState(TRIMESTRES[0]);
  const [materia, setMateria] = useState("");
  const [filas, setFilas] = useState<Record<string, FilaNota>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getFila = (id: string): FilaNota => filas[id] ?? { nota: "", comentario: "" };

  const setNota = (id: string, nota: string) =>
    setFilas((prev) => ({ ...prev, [id]: { ...getFila(id), nota } }));

  const setComentario = (id: string, comentario: string) =>
    setFilas((prev) => ({ ...prev, [id]: { ...getFila(id), comentario } }));

  const handleGuardar = async () => {
    setError("");
    setSuccess("");

    if (!materia.trim()) {
      setError("Ingresa una materia");
      return;
    }

    const calificaciones = estudiantes
      .filter((e) => getFila(e.id).nota.trim() !== "")
      .map((e) => ({
        estudiante_id: e.id,
        materia: materia.trim(),
        nota: parseFloat(getFila(e.id).nota),
        comentario: getFila(e.id).comentario,
        trimestre,
      }));

    if (calificaciones.length === 0) {
      setError("Ingresa al menos una nota");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calificaciones }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      setSuccess(`${calificaciones.length} nota(s) guardada(s) correctamente`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Trimestre</label>
            <select
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
            >
              {TRIMESTRES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Ej: Matemáticas"
          />
        </div>
      </Card>

      <Card>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">✕ {error}</div>
        )}

        {estudiantes.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay estudiantes registrados en este grado
          </p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2 font-bold">Estudiante</th>
                  <th className="text-center py-2 font-bold">Nota (0-20)</th>
                  <th className="text-left py-2 font-bold">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e) => (
                  <tr key={e.id} className="border-b border-gray-200">
                    <td className="py-3">
                      {e.nombre}
                      {e.seccion ? ` (${e.seccion})` : ""}
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.1"
                        value={getFila(e.id).nota}
                        onChange={(ev) => setNota(e.id, ev.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={getFila(e.id).comentario}
                        onChange={(ev) => setComentario(e.id, ev.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Opcional"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          onClick={handleGuardar}
          variant="primary"
          size="lg"
          disabled={loading || estudiantes.length === 0}
        >
          {loading ? "Guardando..." : "Guardar Notas"}
        </Button>
      </Card>
    </>
  );
}
