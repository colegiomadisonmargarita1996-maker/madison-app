"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Estudiante } from "@/types";
import type { CalificacionConProfesor } from "@/lib/db";

interface DatoEstudiante {
  estudiante: Estudiante;
  calificaciones: CalificacionConProfesor[];
}

interface CeldaEdit {
  nota: string;
  comentario: string;
  profesorId?: string;
  profesorNombre?: string;
}

function celdaKey(estudianteId: string, materia: string) {
  return `${estudianteId}::${materia}`;
}

function estadoInicial(datos: DatoEstudiante[]): Record<string, CeldaEdit> {
  const inicial: Record<string, CeldaEdit> = {};
  for (const { calificaciones } of datos) {
    for (const c of calificaciones) {
      inicial[celdaKey(c.estudiante_id, c.materia)] = {
        nota: c.nota != null ? String(c.nota) : "",
        comentario: c.comentario ?? "",
        profesorId: c.profesor_id,
        profesorNombre: c.profesor?.nombre,
      };
    }
  }
  return inicial;
}

export function EditarCalificacionesForm({
  datos,
  trimestre,
}: {
  datos: DatoEstudiante[];
  trimestre: string;
}) {
  const router = useRouter();
  const materiasIniciales = useMemo(
    () =>
      Array.from(
        new Set(datos.flatMap((d) => d.calificaciones.map((c) => c.materia)))
      ),
    [datos]
  );

  const [materias, setMaterias] = useState<string[]>(materiasIniciales);
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [ediciones, setEdiciones] = useState<Record<string, CeldaEdit>>(() =>
    estadoInicial(datos)
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getCelda = (estudianteId: string, materia: string): CeldaEdit =>
    ediciones[celdaKey(estudianteId, materia)] ?? { nota: "", comentario: "" };

  const setCelda = (estudianteId: string, materia: string, cambios: Partial<CeldaEdit>) => {
    const key = celdaKey(estudianteId, materia);
    setEdiciones((prev) => ({ ...prev, [key]: { ...getCelda(estudianteId, materia), ...cambios } }));
  };

  const agregarMateria = () => {
    const materia = nuevaMateria.trim();
    if (!materia || materias.includes(materia)) return;
    setMaterias((prev) => [...prev, materia]);
    setNuevaMateria("");
  };

  const handleGuardar = async () => {
    setError("");
    setSuccess("");

    const calificaciones = [];
    for (const { estudiante } of datos) {
      for (const materia of materias) {
        const celda = getCelda(estudiante.id, materia);
        if (celda.nota.trim() === "") continue;
        calificaciones.push({
          estudiante_id: estudiante.id,
          materia,
          nota: parseFloat(celda.nota),
          comentario: celda.comentario,
          trimestre,
          profesor_id: celda.profesorId,
        });
      }
    }

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
      router.refresh();
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
        <div className="flex items-end gap-3">
          <Input
            label="Agregar materia"
            value={nuevaMateria}
            onChange={(e) => setNuevaMateria(e.target.value)}
            placeholder="Ej: Educación Física"
            className="max-w-xs"
          />
          <Button type="button" variant="secondary" onClick={agregarMateria}>
            Agregar
          </Button>
        </div>
      </Card>

      <Card>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">✓ {success}</div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">✕ {error}</div>
        )}

        {datos.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay estudiantes registrados en este grado
          </p>
        ) : materias.length === 0 ? (
          <p className="text-center text-gray-600">
            Ningún profesor ha cargado notas todavía para este grado/trimestre. Agrega una materia arriba para empezar.
          </p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2 font-bold sticky left-0 bg-white">Estudiante</th>
                  {materias.map((materia) => (
                    <th key={materia} className="text-center py-2 font-bold px-2">
                      {materia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map(({ estudiante }) => (
                  <tr key={estudiante.id} className="border-b border-gray-200 align-top">
                    <td className="py-3 sticky left-0 bg-white">
                      {estudiante.nombre}
                      {estudiante.seccion ? ` (${estudiante.seccion})` : ""}
                    </td>
                    {materias.map((materia) => {
                      const celda = getCelda(estudiante.id, materia);
                      return (
                        <td key={materia} className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={celda.nota}
                            onChange={(ev) =>
                              setCelda(estudiante.id, materia, { nota: ev.target.value })
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center block mx-auto"
                          />
                          <input
                            type="text"
                            value={celda.comentario}
                            onChange={(ev) =>
                              setCelda(estudiante.id, materia, { comentario: ev.target.value })
                            }
                            placeholder="Comentario"
                            className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                          <p className="mt-1 text-[11px] text-gray-500 text-center">
                            {celda.profesorNombre ?? "—"}
                          </p>
                        </td>
                      );
                    })}
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
          disabled={loading || datos.length === 0 || materias.length === 0}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Card>
    </>
  );
}
